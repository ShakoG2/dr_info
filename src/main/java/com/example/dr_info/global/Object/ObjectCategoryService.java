package com.example.dr_info.global.Object;


import com.example.dr_info.model.drInfo.ObjectInfo;
import com.example.dr_info.model.transformator.ObjectCategory;
import com.example.dr_info.model.transformator.ObjectSubscriber;
import com.example.dr_info.repository.dispatch.ObjectSubscriberRepository;
import com.example.dr_info.repository.drInfo.ObjectInfoRepository;
import io.swagger.models.auth.In;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ObjectCategoryService {

	private final ObjectInfoRepository objectInfoRepository;
	private final ObjectSubscriberRepository objectSubscriberRepository;
	//	SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MMM/dd");

	public Date getFirstDateToMonth(int year, int month) {
		return generateDate(year, month, 1);
	}

	public Date generateDate(int year, int month, int dayN) {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.YEAR, year);
		cal.set(Calendar.MONTH, month - 1);
		cal.set(Calendar.DAY_OF_MONTH, dayN);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);
		return cal.getTime();
	}

	public Date getLastDateToMonth(int year, int month) {
		Calendar cal = Calendar.getInstance();
		return generateDate(year, month, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
	}


	public void exportData(Integer year, Integer month) throws ParseException {
		String dbURL = "jdbc:sqlserver://192.168.150.167:1433;database=DR_INFO";
		String user = "sa";
		String password = "barsa-2008";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		String dateFrom = sdf.format(getFirstDateToMonth(year, month));
		String dateTo = sdf.format(getLastDateToMonth(year, month));

		List<ObjectInfo> transformators = objectInfoRepository.getDataDateFromAndDateTo(sdf.parse(dateFrom),
																						sdf.parse(dateTo)
		);

		try {
			Connection conn = DriverManager.getConnection(dbURL, user, password);
			CallableStatement statement = conn.prepareCall("{call InsertNewDataAndFilterInObjectInfoPartOne(?,?)}");
			statement.setString(1, dateFrom);
			statement.setString(2, dateTo);
			statement.execute();
			statement.close();

			CallableStatement statement1 = conn.prepareCall("{call InsertNewDataAndFilterInObjectInfoPartTwo()}");
			statement1.execute();
			statement1.close();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}


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

	public List<ObjectInfo> search(Long taskId,
								   String custNumber,
								   Integer year,
								   Integer month,
								   Pageable pageable) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date dateFrom = new SimpleDateFormat("yyyy-MM-dd").parse(sdf.format(getFirstDateToMonth(year, month)));
		Date dateTo = new SimpleDateFormat("yyyy-MM-dd").parse(sdf.format(getLastDateToMonth(year, month)));

		if (StringUtils.hasText(custNumber) && taskId != null) {
			return objectInfoRepository.findAllByTaskIdAndCustNumberAndActiveTrueAndDisconnectedDateGreaterThanEqualAndReconnectedDateLessThanEqual(taskId, custNumber, dateFrom, dateTo);
		}

		if (StringUtils.hasText(custNumber))
			return objectInfoRepository.findAllByCustNumberAndActiveTrueAndDisconnectedDateGreaterThanEqualAndReconnectedDateLessThanEqual(custNumber, dateFrom, dateTo).stream().map(this::calculateDuration).collect(Collectors.toList());

		if (taskId != null)
			return objectInfoRepository.findAllByTaskIdAndActiveTrueAndDisconnectedDateGreaterThanEqualAndReconnectedDateLessThanEqual(taskId, dateFrom, dateTo).stream().map(this::calculateDuration).collect(Collectors.toList());

		return objectInfoRepository.findAllByActiveTrueAndDisconnectedDateGreaterThanEqualAndReconnectedDateLessThanEqual(dateFrom, dateTo).stream().map(this::calculateDuration).collect(Collectors.toList());
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
