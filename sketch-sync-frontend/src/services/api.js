const API_BASE = "http://localhost:8080/api/boards";

export const fetchBoardState = async (boardId) => {
  try {
    const response = await fetch(`${API_BASE}/${boardId}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching board:", error);
    return [];
  }
};

export const saveBoardState = async (boardId, lines) => {
  try {
    await fetch(`${API_BASE}/${boardId}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lines),
    });
    alert("Board saved successfully!");
  } catch (error) {
    console.error("Error saving board:", error);
  }
};
