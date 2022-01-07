package com.example.dr_info.repository.dispatch;

import com.example.dr_info.model.transformator.DispatchTask;
import com.example.dr_info.model.transformator.ObjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Repository
public interface ObjectCategoryRepository extends JpaRepository<ObjectCategory, BigDecimal> {

	List<ObjectCategory> findAllByCustNumber(String number);

	@Query("SELECT o FROM ObjectCategory o WHERE o.category = :category AND " +
			"o.insertDate >= :lastMonthFirstDate AND o.insertDate<= :lastMonthLastDate")
	List<ObjectCategory> getPreviousMonthData(String category,Date lastMonthFirstDate, Date lastMonthLastDate);

//	@Query(nativeQuery = true,value = "exec DR_INFO.dbo.InsertNewDataAndFilterInObjectInfo '2021-10-01', '2021-10-31'")
	@Procedure(procedureName = "InsertNewDataAndFilterInObjectInfo")
	void InsertNewDataAndFilterInObjectInfo(@Param("StartDate") String startDate, @Param("EndDate") String endDate);

}
