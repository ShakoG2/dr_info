package com.example.dr_info.repository.dispatch;

import com.example.dr_info.model.transformator.ObjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObjectCategoryRepository extends JpaRepository<ObjectCategory,Long> {

	List<ObjectCategory> findAllByCustNumber(String number);
}
