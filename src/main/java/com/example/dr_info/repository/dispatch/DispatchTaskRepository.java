package com.example.dr_info.repository.dispatch;

import com.example.dr_info.model.transformator.DispatchTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface DispatchTaskRepository extends JpaRepository<DispatchTask,BigDecimal> {

	@Query("SELECT o FROM DispatchTask o WHERE o.id = :id")
	DispatchTask getTaskById(BigDecimal id);
}
