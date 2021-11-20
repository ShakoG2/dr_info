package com.example.dr_info.controller;

import com.example.dr_info.global.Object.ObjectCategoryService;
import com.example.dr_info.model.transformator.ObjectCategory;
import com.example.dr_info.model.user.ObjectInfo;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("category")
@AllArgsConstructor
public class CategoryController {

	private final ObjectCategoryService objectCategoryService;

//	@GetMapping
//	public List<ObjectCategory> get() {
//		return objectCategoryService.getPreviousMonthData();
//	}

	@GetMapping
	public Page<ObjectInfo> get(@RequestParam(required = false) Long taskId,
								@RequestParam(required = false) String custNumber,
								@RequestParam(required = false, defaultValue = "0") Integer start,
								@RequestParam(required = false, defaultValue = "1") Integer page,
								@RequestParam(required = false, defaultValue = "100") Integer limit) {
		return objectCategoryService.search(taskId, custNumber,
											PageRequest.of(page - 1, limit));
	}
}
