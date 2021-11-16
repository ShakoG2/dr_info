package com.example.dr_info.controller;

import com.example.dr_info.global.Object.ObjectCategoryService;
import com.example.dr_info.model.transformator.ObjectCategory;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("category")
@AllArgsConstructor
public class CategoryController {

	private final ObjectCategoryService objectCategoryService;

	@GetMapping
	public List< ObjectCategory> get() {
		return objectCategoryService.getPreviousMonthData();
	}
}
