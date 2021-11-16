package com.example.dr_info.repository.drInfo;

import com.example.dr_info.model.user.ObjectInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjectInfoRepository extends JpaRepository<ObjectInfo,Long> {
}
