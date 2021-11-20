package com.example.dr_info.repository.drInfo;

import com.example.dr_info.model.user.ObjectInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjectInfoRepository extends PagingAndSortingRepository<ObjectInfo, Long> {

	Page<ObjectInfo> findAllByCustNumberAndActiveTrue(String custN, Pageable pageable);

	Page<ObjectInfo> findAllByActiveTrue(Pageable pageable);


	Page<ObjectInfo> findAllByTaskIdAndCustNumberAndActiveTrue(Long taskId, String custN, Pageable pageable);


	Page<ObjectInfo> findAllByTaskIdAndActiveTrue(Long taskId, Pageable pageable);
}
