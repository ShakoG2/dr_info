package com.example.dr_info.global.Object;

import com.example.dr_info.model.transformator.ObjectCategory;
import com.example.dr_info.repository.dispatch.ObjectCategoryRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ObjectCategoryService {

	private final ObjectCategoryRepository objectCategoryRepository;

	public List< ObjectCategory> get() {
		List<ObjectCategory> categories = objectCategoryRepository.findAllByCustNumber("5710011060");
		return categories;
	}

}
