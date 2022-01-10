package com.example.dr_info.repository.drInfo;

import com.example.dr_info.model.drInfo.ObjectInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface ObjectInfoRepository extends PagingAndSortingRepository<ObjectInfo, Long> {

	Page<ObjectInfo> findAllByCustNumberAndActiveTrue(String custN, Pageable pageable);

	Set<ObjectInfo> findAllByCustNumberAndActiveTrue(String custN);

	Page<ObjectInfo> findAllByActiveTrue(Pageable pageable);

	@Query("SELECT o FROM ObjectInfo o WHERE o.active = true")
	List<ObjectInfo> findAllActive();

	@Query("SELECT DISTINCT o.custNumber FROM ObjectInfo o WHERE o.active = true")
	List<String> getCustNumbers();

	@Query("select o from ObjectInfo o where o.disconnectedDate>= :dateFrom and o.reconnectedDate<= :dateTo")
	List<ObjectInfo> getDataDateFromAndDateTo(Date dateFrom, Date dateTo);

//	@Query("SELECT o FROM ObjectInfo o WHERE o.active = true AND O.custNumber = :custNumber")
//	List<ObjectInfo> getAllActiveObjectByCustNumber(String custNumber);

	Page<ObjectInfo> findAllByTaskIdAndCustNumberAndActiveTrue(Long taskId, String custN, Pageable pageable);


	Page<ObjectInfo> findAllByTaskIdAndActiveTrue(Long taskId, Pageable pageable);
}
