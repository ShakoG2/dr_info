package com.example.dr_info.repository.dispatch;

import com.example.dr_info.model.transformator.Transformator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransformatorRepository extends JpaRepository<Transformator,Long> {
}
