package com.example.dr_info.global.Object;

import com.example.dr_info.model.transformator.DispatchTask;
import com.example.dr_info.model.transformator.ObjectCategory;
import com.example.dr_info.model.user.ObjectInfo;
import com.example.dr_info.repository.dispatch.DispatchTaskRepository;
import com.example.dr_info.repository.dispatch.ObjectCategoryRepository;
import com.example.dr_info.repository.drInfo.ObjectInfoRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class ObjectCategoryService {

	private final ObjectCategoryRepository objectCategoryRepository;
	private final DispatchTaskRepository dispatchTaskRepository;
	private final ObjectInfoRepository objectInfoRepository;

	public List<ObjectCategory> get() {
		List<ObjectCategory> categories = objectCategoryRepository.findAllByCustNumber("5710011060");
		return categories;
	}

	public List<ObjectCategory> getPreviousMonthData() {
		Calendar aCalendar = Calendar.getInstance();

		aCalendar.add(Calendar.MONTH, -1);
		aCalendar.set(Calendar.DATE, 1);
		Date firstDateOfPreviousMonth = aCalendar.getTime();
		aCalendar.set(Calendar.DATE, aCalendar.getActualMaximum(Calendar.DAY_OF_MONTH));
		Date lastDateOfPreviousMonth = aCalendar.getTime();
		List<ObjectCategory> transformators = objectCategoryRepository.getPreviousMonthData("customer.category.transformer", firstDateOfPreviousMonth, lastDateOfPreviousMonth);

//		transformators.forEach(t -> {
//			ObjectInfo objectInfo = new ObjectInfo();
//			DispatchTask task = dispatchTaskRepository.getById(t.getTaskId());
//			objectInfo.setCustNumber(t.getCustNumber());
//			objectInfo.setDisconnectedDate(task.getDisconnActualDate());
//			objectInfo.setDisconnectedTime(task.getDisconnActualTime());
//			objectInfo.setReconnectedDate(task.getReconnActualDate());
//			objectInfo.setReconnectedTime(task.getReconnActualTime());
//			objectInfo.setTaskId(task.getId().longValue());
//			try {
//				objectInfo.setTurnOffDuration(diffTime(task.getDisconnActualTime(),task.getReconnActualTime()).toString());
//			} catch (ParseException e) {
//				e.printStackTrace();
//			}
//			objectInfoRepository.save(objectInfo);
//		});

		return transformators;
	}

	public Long diffTime(String t1,String t2) throws ParseException {
		SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
		Date date1 = format.parse(t1);
		Date date2 = format.parse(t2);
		return date2.getTime() - date1.getTime();
	}

}
