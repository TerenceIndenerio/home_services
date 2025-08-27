import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 40,
  },

  imageContainer: {
    display: "flex",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 0.5,
    minHeight: 200,
  },

  mainImage: {
    width: 276,
    height: 276,
    aspectRatio: 1,
    resizeMode: "contain",
  },

  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    width: "100%",
    flex: 0.3,
    justifyContent: "center",
  },

  title: {
    color: "#8C52FF",
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 10,
    width: "100%",
  },

  subtitle: {
    color: "#444",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    fontWeight: "400",
    paddingHorizontal: 10,
    width: "100%",
    lineHeight: 22,
  },

  navigationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 23,
    width: "100%",
    flex: 0.2,
  },

  paginationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  paginationDot: {
    width: 34,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#D9D9D9",
  },

  activePaginationDot: {
    backgroundColor: "#8C52FF",
  },
}); 