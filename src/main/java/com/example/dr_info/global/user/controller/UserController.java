package com.example.dr_info.global.user.controller;

import com.example.dr_info.global.user.User;
import com.example.dr_info.global.user.UserDetailsImpl;
import com.example.dr_info.global.user.UserSummary;
import com.example.dr_info.global.user.service.UserService;
import javassist.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("myself")
	public UserSummary getCurrentUserSummery(@AuthenticationPrincipal final UserDetailsImpl currentUserDetails) throws NotFoundException {
		if (currentUserDetails == null) {
			throw new RuntimeException("user not logged in");
		}

		User user = userService.getById(currentUserDetails.getId());

		UserSummary userSummary = new UserSummary();
		userSummary.setUserId(user.getId());
		userSummary.setUsername(user.getUserName());
		userSummary.setFirstName(user.getFirstName());
		userSummary.setLastName(user.getLastName());
		userSummary.setPersonalNo(user.getPersonalNo());

		return userSummary;
	}

}
