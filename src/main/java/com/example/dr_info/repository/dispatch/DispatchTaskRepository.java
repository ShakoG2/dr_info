package com.example.dr_info.repository.dispatch;

import com.example.dr_info.model.transformator.DispatchTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DispatchTaskRepository extends JpaRepository<DispatchTask,Long> {
}
