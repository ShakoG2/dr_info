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
		basePackages = "com.example.dr_info.repository.drInfo",
		entityManagerFactoryRef = "drInfoEntityManagerFactory",
		transactionManagerRef = "drInfoTransactionManager"
)
public class DrConf {

	@Bean(name="sportDSProps")
	@ConfigurationProperties("spring.datasource")
	public DataSourceProperties dataSourceProperties() {
		return new DataSourceProperties();
	}


	@Bean(name = "springDataSource")
	@ConfigurationProperties("spring.datasource")
	public DataSource dataSource(@Qualifier("sportDSProps") DataSourceProperties properties) {
		return properties.initializeDataSourceBuilder().build();
	}

	@Bean(name = "drInfoEntityManagerFactory")
	public LocalContainerEntityManagerFactoryBean sportEntityManagerFactory(
			EntityManagerFactoryBuilder builder,
			@Qualifier("springDataSource") DataSource sportDataSource
	) {
		return
				builder.dataSource(sportDataSource)
						.packages("com.example.dr_info.model.drInfo")
						.persistenceUnit("drInfo")
						.build();
	}

	@Bean(name = "drInfoTransactionManager")
	//@ConfigurationProperties("sport.jpa")
	public PlatformTransactionManager sportTransactionManager(
			@Qualifier("drInfoEntityManagerFactory") EntityManagerFactory
					sportEntityManagerFactory
	) {
		return new JpaTransactionManager(sportEntityManagerFactory);
	}
}
