package com.example.dr_info;

import com.example.dr_info.global.user.User;
import com.example.dr_info.global.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class TestController {

	private final UserRepository userRepository;

	@GetMapping
	public List<User> get() {
		return userRepository.findAll();
	}
}
