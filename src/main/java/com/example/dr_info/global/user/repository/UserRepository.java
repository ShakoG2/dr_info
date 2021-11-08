package com.example.dr_info.global.user.repository;

import com.example.dr_info.global.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	User findByUserName(String username);
}
