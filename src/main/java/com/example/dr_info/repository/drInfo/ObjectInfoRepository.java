package com.example.dr_info.repository.drInfo;

import com.example.dr_info.model.drInfo.ObjectInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface ObjectInfoRepository extends JpaRepository<ObjectInfo, Long> {

	List<ObjectInfo> findAllByCustNumberAndActiveTrueAndDisconnectedDateGreaterThanEqualAndReconnectedDateLessThanEqual( String custN,Date dateFrom, Date dateTo);

	Set<ObjectInfo> findAllByCustNumberAndActiveTrue(String custN);

	List<ObjectInfo> findAllByActiveTrueAndDisconnectedDateGreaterThanEqualAndReconnectedDateLessThanEqual(Date dateFrom, Date dateTo);

	@Query("SELECT o FROM ObjectInfo o WHERE o.active = true")
	List<ObjectInfo> findAllActive();

	@Query("SELECT DISTINCT o.custNumber FROM ObjectInfo o WHERE o.active = true")
	List<String> getCustNumbers();

	@Query("select o from ObjectInfo o where o.disconnectedDate>= :dateFrom and o.reconnectedDate<= :dateTo")
	List<ObjectInfo> getDataDateFromAndDateTo(Date dateFrom, Date dateTo);

//	@Query("SELECT o FROM ObjectInfo o WHERE o.active = true AND O.custNumber = :custNumber")
//	List<ObjectInfo> getAllActiveObjectByCustNumber(String custNumber);

	List<ObjectInfo> findAllByTaskIdAndCustNumberAndActiveTrueAndDisconnectedDateGreaterThanEqualAndReconnectedDateLessThanEqual(Long taskId, String custN, Date dateFrom, Date dateTo);


	List<ObjectInfo> findAllByTaskIdAndActiveTrueAndDisconnectedDateGreaterThanEqualAndReconnectedDateLessThanEqual(Long taskId, Date dateFrom, Date dateTo);
}
