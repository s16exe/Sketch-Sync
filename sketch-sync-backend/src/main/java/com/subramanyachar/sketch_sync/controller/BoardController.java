package com.subramanyachar.sketch_sync.controller;


import com.subramanyachar.sketch_sync.dto.DrawPayload;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class BoardController {

    @MessageMapping("/draw/{boardId}")
    @SendTo("/topic/board/{boardId}")
    public DrawPayload broadcastDrawing(@DestinationVariable String boardId, DrawPayload payload) {
        return payload;
    }
}