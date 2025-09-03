import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end", // affichage en bas
        margin: 0,
    },
    modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    },
    modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    },
    image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    },
    date: {
    marginBottom: 10,
    fontWeight: "bold",
    },
    closeButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    },
});
