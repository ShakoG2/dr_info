package com.example.dr_info.global.Object;


import com.example.dr_info.model.drInfo.ObjectInfo;
import com.example.dr_info.model.transformator.ObjectSubscriber;
import com.example.dr_info.repository.dispatch.ObjectSubscriberRepository;
import com.example.dr_info.repository.drInfo.ObjectInfoRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@AllArgsConstructor
public class ObjectCategoryService {

	private final ObjectInfoRepository objectInfoRepository;
	private final ObjectSubscriberRepository objectSubscriberRepository;


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

	public List<ObjectSubscriber> getAllSubscriberByCustNumber(String custNumber) {
		List<ObjectSubscriber> subscribers = objectSubscriberRepository.getAllSubByCustnumber(custNumber);
		subscribers
				.forEach(subscriber -> {
					List<ObjectSubscriber> objectSubscribers = new ArrayList<>();
					Set<ObjectInfo> transformators = objectInfoRepository.findAllByCustNumberAndActiveTrue(custNumber);
					subscriber.setDisconnectedDate(transformators.iterator().next().getDisconnectedDate());
					subscriber.setDisconnectedTime(transformators.iterator().next().getDisconnectedTime());
					subscriber.setReconnectedDate(transformators.iterator().next().getReconnectedDate());
					subscriber.setReconnectedTime(transformators.iterator().next().getReconnectedTime());
				});

		return subscribers;
	}
}
