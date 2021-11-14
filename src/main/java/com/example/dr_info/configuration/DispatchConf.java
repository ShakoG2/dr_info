package com.example.dr_info.configuration;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

@Configuration
@PropertySource({"classpath:application.properties"})
@EnableJpaRepositories(
		basePackages = "com.example.dr_info.repository.dispatch",
		entityManagerFactoryRef = "dispatchEntityManagerFactory",
		transactionManagerRef = "dispatchTransactionManager"
)
public class DispatchConf {

	@Primary
	@Bean(name="dispatch")
	@ConfigurationProperties("dispatch.datasource")
	public DataSourceProperties dispatchDataSourceProperties() {
		return new DataSourceProperties();
	}


	@Primary
	@Bean(name = "dispatchDataSource")
	@ConfigurationProperties("dispatch.datasource")
	public DataSource dispatchDataSource(@Qualifier("dispatch") DataSourceProperties properties) {
		return properties.initializeDataSourceBuilder().build();
	}

	@Primary
	@Bean(name = "dispatchEntityManagerFactory")
	public LocalContainerEntityManagerFactoryBean dispatchEntityManagerFac(
			EntityManagerFactoryBuilder builder,
			@Qualifier("dispatchDataSource") DataSource sportDataSource
	) {
		return
				builder.dataSource(sportDataSource)
						.packages("com.example.dr_info.model.transformator")
						.persistenceUnit("dispatch")
						.build();
	}

	@Primary
	@Bean(name = "dispatchTransactionManager")
	//@ConfigurationProperties("sport.jpa")
	public PlatformTransactionManager dispatchTransactionManager(
			@Qualifier("dispatchEntityManagerFactory") EntityManagerFactory
					sportEntityManagerFactory
	) {
		return new JpaTransactionManager(sportEntityManagerFactory);
	}

}
