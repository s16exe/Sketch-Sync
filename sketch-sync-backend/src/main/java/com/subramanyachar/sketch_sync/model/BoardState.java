package com.subramanyachar.sketch_sync.model;


import jakarta.persistence.*;

@Entity
@Table(name = "boards")
public class BoardState {

    @Id
    private String boardId;

    // We store the entire array of Konva lines as a single JSON string
    @Column(columnDefinition = "TEXT")
    private String elementsJson;

    public BoardState() {}

    public BoardState(String boardId, String elementsJson) {
        this.boardId = boardId;
        this.elementsJson = elementsJson;
    }

    public String getBoardId() { return boardId; }
    public void setBoardId(String boardId) { this.boardId = boardId; }

    public String getElementsJson() { return elementsJson; }
    public void setElementsJson(String elementsJson) { this.elementsJson = elementsJson; }
}
