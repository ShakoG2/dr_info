package com.example.dr_info.global.Object;

import com.example.dr_info.model.transformator.DispatchTask;
import com.example.dr_info.model.transformator.ObjectCategory;
import com.example.dr_info.model.user.ObjectInfo;
import com.example.dr_info.model.user.ObjectInfo_;
import com.example.dr_info.repository.dispatch.DispatchTaskRepository;
import com.example.dr_info.repository.dispatch.ObjectCategoryRepository;
import com.example.dr_info.repository.drInfo.ObjectInfoRepository;
import io.swagger.models.auth.In;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class ObjectCategoryService {

	private final ObjectCategoryRepository objectCategoryRepository;
	private final DispatchTaskRepository dispatchTaskRepository;
	private final ObjectInfoRepository objectInfoRepository;


	public String roundHour(String hour) {

		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime localDateTime = LocalDateTime.parse(hour, dtf);


		int minutes = localDateTime.getMinute();
		if (minutes >= 30) {
			localDateTime = localDateTime.plusHours(1);
		}

		localDateTime = localDateTime.truncatedTo(ChronoUnit.HOURS);

		return dtf.format(localDateTime);
	}

	public Page<ObjectInfo> search(Long taskId, String custNumber, Pageable pageable) {

		if (StringUtils.hasText(custNumber) && taskId != null) {
			return objectInfoRepository.findAllByTaskIdAndCustNumberAndActiveTrue(taskId, custNumber, pageable);
		}

		if (StringUtils.hasText(custNumber))
			return objectInfoRepository.findAllByCustNumberAndActiveTrue(custNumber, pageable).map(this::calculateDuration);

		if (taskId != null)
			return objectInfoRepository.findAllByTaskIdAndActiveTrue(taskId, pageable).map(this::calculateDuration);

		return objectInfoRepository.findAllByActiveTrue(pageable).map(this::calculateDuration);
	}

	public ObjectInfo calculateDuration(ObjectInfo objectInfo) {
		if (!Objects.equals(objectInfo.getTurnOffDuration(), "0") &&
				objectInfo.getTurnOffDuration() != null) {
			int dur = Integer.parseInt(objectInfo.getTurnOffDuration()) / 60;
			objectInfo.setTurnOffDuration(Integer.toString(dur));
		}
		return objectInfo;
	}
}
