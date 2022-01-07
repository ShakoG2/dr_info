package com.example.dr_info.controller;

import com.example.dr_info.global.Object.ObjectCategoryService;
import com.example.dr_info.model.drInfo.ObjectInfo;
//import com.example.dr_info.model.transformator.ObjectSubscriber;
import com.example.dr_info.model.transformator.ObjectSubscriber;
import com.example.dr_info.repository.dispatch.ObjectCategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("category")
@AllArgsConstructor
public class CategoryController {

	private final ObjectCategoryService objectCategoryService;
	private final ObjectCategoryRepository objectCategoryRepository;

	@GetMapping
	public Page<ObjectInfo> get(@RequestParam(required = false) Long taskId,
								@RequestParam(required = false) String custNumber,
								@RequestParam(required = false, defaultValue = "0") Integer start,
								@RequestParam(required = false, defaultValue = "1") Integer page,
								@RequestParam(required = false, defaultValue = "100") Integer limit) {

		return objectCategoryService.search(taskId, custNumber,
											PageRequest.of(page - 1, limit));
	}


	@GetMapping("subscribers")
	public List<ObjectSubscriber> getAllSubscriberByObjectCustNumber(@RequestParam String custNumber) {
		return objectCategoryService.getAllSubscriberByCustNumber(custNumber);
	}

	@PostMapping("load-transformators")
	public void loadTransformators() {
		objectCategoryService.exportData();
	}

}
