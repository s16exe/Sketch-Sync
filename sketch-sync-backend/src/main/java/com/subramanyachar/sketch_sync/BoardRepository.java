package com.subramanyachar.sketch_sync;

import com.subramanyachar.sketch_sync.model.BoardState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<BoardState, String> {
}
