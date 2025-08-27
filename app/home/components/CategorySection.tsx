import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import CategoryItem from "./CategoryItem";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { useRouter } from "expo-router";

const db = getFirestore(app);

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobCategories"));
        const cats: any[] = [];
        querySnapshot.forEach((doc) => {
          cats.push({ id: doc.id, ...doc.data() });
        });
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <View>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.viewAllText}>View All</Text>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem
            name={item.name}
            imageUrl={item.imageUrl || "https://via.placeholder.com/50"}
            onPress={() => {
              const params = new URLSearchParams({
                name: item.name,
                exampleServices: (item.exampleServices || []).join(","),
              }).toString();
              router.push(`/category-users/${item.name}?${params}`);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 21,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(68, 68, 68, 1)",
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(107, 17, 244, 1)",
  },
  categoriesList: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 12,
  },
});

export default CategorySection;
