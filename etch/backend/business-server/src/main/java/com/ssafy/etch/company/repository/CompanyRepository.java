package com.ssafy.etch.company.repository;

<<<<<<< etch/backend/business-server/src/main/java/com/ssafy/etch/company/repository/CompanyRepository.java
import java.util.List;
import java.util.Optional;

=======
import com.ssafy.etch.company.entity.CompanyEntity;
>>>>>>> etch/backend/business-server/src/main/java/com/ssafy/etch/company/repository/CompanyRepository.java
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface CompanyRepository extends JpaRepository<CompanyEntity, Long> {
<<<<<<< etch/backend/business-server/src/main/java/com/ssafy/etch/company/repository/CompanyRepository.java
	Optional<CompanyEntity> findById(long id);
=======
    List<CompanyEntity> findAllByIdIn(Collection<Long> id);
>>>>>>> etch/backend/business-server/src/main/java/com/ssafy/etch/company/repository/CompanyRepository.java
}
