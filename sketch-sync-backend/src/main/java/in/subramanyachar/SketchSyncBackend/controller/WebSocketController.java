package in.subramanyachar.BACKEND.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@CrossOrigin
@Controller
public class WebSocketController {
    private final Map<String, Map<String, Object>> chats = new HashMap<>();

    @MessageMapping("/draw/{chatId}")
    @SendTo("/topic/draw/{chatId}")
    public Map<String, Object> sendMessageWithWebsocket(
            @DestinationVariable String chatId,
            @Payload Map<String, Object> message) {

        chats.put(chatId, message);
        return message;
    }
}
