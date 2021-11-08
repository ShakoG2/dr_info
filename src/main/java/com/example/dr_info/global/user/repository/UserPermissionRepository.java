package com.example.dr_info.global.user.repository;

import com.example.dr_info.global.user.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission,Long> {

	//List<String> getUserAuthorities(long userId);
}
