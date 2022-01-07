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

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
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


	public void exportData() {
		String dbURL = "jdbc:sqlserver://192.168.150.167:1433;database=DR_INFO";
		String user = "sa";
		String password = "barsa-2008";

		try {

			Connection conn = DriverManager.getConnection(dbURL, user, password);

			CallableStatement statement = conn.prepareCall("insert into DR_INFO.dbo.object_infos(task_id,customerNumber,\n" +
																   "                                     disconnected_date,\n" +
																   "                                     disconnected_time,\n" +
																   "                                     reconnected_date,\n" +
																   "                                     reconnected_time,\n" +
																   "                                     turn_off_duration)\n" +
																   "select\n" +
																   "\tdi.TASK_ID,\n" +
																   "    di.cust_number,\n" +
																   "\tdt.DISCONN_ACTUAL_DATE,\n" +
																   "\tdt.DISCONN_ACTUAL_TIME,\n" +
																   "\tdt.RECONN_ACTUAL_DATE,\n" +
																   "\tdt.RECONN_ACTUAL_TIME,\n" +
																   "    null\n" +
																   "from DISPATCH.dbo.DISCONN_HISTORY di\n" +
																   "inner join DISPATCH.dbo.DISPATCH_TASK dt on di.TASK_ID = dt.ID\n" +
																   "where di.INSERT_DATE >= '2021-10-01' and\n" +
																   "      di.INSERT_DATE <= '2021-10-31' and\n" +
																   "      di.categ_key = 'customer.category.transformer';\n" +
																   "\n" +
																   "select datediff(mi, cast(o.disconnected_time as time), cast(o.reconnected_time as time))\n" +
																   "from DR_INFO.dbo.object_infos o;\n" +
																   "\n" +
																   "select datediff(day, cast(o.disconnected_date as date), cast(o.reconnected_date as date))\n" +
																   "from DR_INFO.dbo.object_infos o\n" +
																   "where disconnected_date < reconnected_date;\n" +
																   "\n" +
																   "\n" +
																   "update DR_INFO.dbo.object_infos\n" +
																   "set turn_off_duration = datediff(mi, cast(o.disconnected_time as time), cast(o.reconnected_time as time))\n" +
																   "from DR_INFO.dbo.object_infos o;\n" +
																   "\n" +
																   "update DR_INFO.dbo.object_infos\n" +
																   "set turn_off_duration = datediff(mi, cast(o.reconnected_time as time), cast(o.disconnected_time as time))\n" +
																   "\t+ datediff(day, cast(o.disconnected_date as date), cast(o.reconnected_date as date)) * 1440\n" +
																   "from DR_INFO.dbo.object_infos o\n" +
																   "where o.disconnected_date < o.reconnected_date;\n" +
																   "\n" +
																   "\n" +
																   "update DR_INFO.dbo.object_infos\n" +
																   "set reconnected_time=DATEADD(hour, DATEDIFF(hour, 0,DATEADD(minute,30 -DATEPART(minute, cast(o.reconnected_time as datetime) +'00:30:00.000'),cast(o.reconnected_time as datetime))), 0)\n" +
																   "from DR_INFO.dbo.object_infos o;\n" +
																   "\n" +
																   "update DR_INFO.dbo.object_infos\n" +
																   "set reconnected_time=cast(o.reconnected_time as time)\n" +
																   "from DR_INFO.dbo.object_infos o;\n" +
																   "\n" +
																   "update DR_INFO.dbo.object_infos\n" +
																   "set object_infos.active=1\n" +
																   "from DR_INFO.dbo.object_infos o\n" +
																   "where o.turn_off_duration is not null and o.turn_off_duration != '0';\n" +
																   "\n" +
																   "update DR_INFO.dbo.object_infos\n" +
																   "set object_infos.active=0\n" +
																   "from DR_INFO.dbo.object_infos o\n" +
																   "where o.turn_off_duration is null or o.turn_off_duration = '0';\n" +
																   "\n" +
																   "update DR_INFO.dbo.object_infos\n" +
																   "set active = 1\n" +
																   "where turn_off_duration > -1\n" +
																   "\n" +
																   "-- second part\n" +
																   "\n" +
																   "DROP Table if exists #A;\n" +
																   "DROP Table if exists #B;\n" +
																   "Drop TABLE if exists #C;\n" +
																   "\n" +
																   "SELECT\n" +
																   "task_id\n" +
																   ",MIN(disconnected_date) AS disc_date\n" +
																   ",MIN(disconnected_time) AS disc_time\n" +
																   ",MAX(reconnected_date) AS rec_date\n" +
																   ",MAX(reconnected_time) AS rec_time\n" +
																   ",MAX(turn_off_duration) AS turn_off_duration\n" +
																   "into #A\n" +
																   "FROM object_infos\n" +
																   "where object_infos.active = 1\n" +
																   "GROUP BY task_id;\n" +
																   "select * from #A\n" +
																   "-- move data to #A\n" +
																   "-- move data to #B with customernumber\n" +
																   "-- move joind data to #C\n" +
																   "-- Delete Data from object_infos\n" +
																   "-- insert data in Object_infos From #C\n" +
																   "-- make Active True\n" +
																   "\n" +
																   "select task_id,customerNumber\n" +
																   "into #B\n" +
																   "from object_infos\n" +
																   "\n" +
																   "select #A.task_id,#A.disc_date,#A.disc_time,#A.rec_date,#A.rec_time,#A.turn_off_duration,max(#B.customerNumber) as customerNumber\n" +
																   "into #C from #A\n" +
																   "inner join #B on #A.task_id = #B.task_id\n" +
																   "group by #A.task_id, #A.disc_date, #A.disc_time, #A.rec_date, #A.rec_time, #A.turn_off_duration\n" +
																   "\n" +
																   "delete from object_infos\n" +
																   "\n" +
																   "insert into object_infos(task_id, disconnected_date, disconnected_time, reconnected_date, reconnected_time, turn_off_duration,customerNumber)\n" +
																   "select * from #C\n" +
																   "\n" +
																   "update object_infos\n" +
																   "set active = 1;");
//			statement.setString(1, "2021-10-01");
//			statement.setString(2, "2021-10-31");

			statement.execute();
			statement.close();
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
