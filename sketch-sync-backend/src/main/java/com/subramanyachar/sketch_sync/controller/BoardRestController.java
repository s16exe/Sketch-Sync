package com.subramanyachar.sketch_sync.controller;

import com.subramanyachar.sketch_sync.BoardRepository;
import com.subramanyachar.sketch_sync.model.BoardState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "*")
public class BoardRestController {

    @Autowired
    private BoardRepository repository;

    @GetMapping("/{id}")
    public ResponseEntity<String> getBoard(@PathVariable String id) {
        String json = repository.findById(id)
                .map(BoardState::getElementsJson)
                .orElse("[]");

        // Explicitly setting the Content-Type to JSON so React parses it automatically
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(json);
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Void> saveBoard(@PathVariable String id, @RequestBody Object elements) {
        try {
            // Convert the object back to a clean JSON string for storage
            ObjectMapper mapper = new ObjectMapper();
            String elementsJson = mapper.writeValueAsString(elements);

            BoardState board = new BoardState(id, elementsJson);
            repository.save(board);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}