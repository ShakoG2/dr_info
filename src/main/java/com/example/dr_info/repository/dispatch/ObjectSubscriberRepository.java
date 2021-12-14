package com.example.dr_info.repository.dispatch;

import com.example.dr_info.model.transformator.ObjectSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObjectSubscriberRepository extends JpaRepository<ObjectSubscriber, Long> {

	@Query("SELECT s FROM ObjectSubscriber s WHERE s.transformerCustNumber = :custNumber AND s.isSupplyCustomer = 0")
	List<ObjectSubscriber> getAllSubByCustnumber(String custNumber);
}
