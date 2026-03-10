package com.subramanyachar.sketch_sync.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Data
@Setter
@Getter
public class DrawPayload {
    private String id;
    private String type; // "line", "rectangle", "circle"
    private String tool; // "pen", "eraser", etc.
    private List<Double> points;
    private String color;
    private int brushSize;

    // Geometry for shapes
    private Double x;
    private Double y;
    private Double width;
    private Double height;
    private Double radius;

    // Standard Getters and Setters for ALL fields...

}