package com.ssafy.etch.global.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3Service {
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	private final AmazonS3 amazonS3;

	public List<String> uploadFiles(List<MultipartFile> multipartFiles) {
		List<String> fileUrlList = new ArrayList<>();

		// forEach 구문을 통해 multipartFiles 리스트로 넘어온 파일들을 순차적으로 fileNameList 에 추가
		multipartFiles.forEach(file -> {
			fileUrlList.add(uploadFile(file));
		});

		return fileUrlList;
	}

	public String uploadFile(MultipartFile file) {
		String fileName = createFileName(file.getOriginalFilename());
		ObjectMetadata objectMetadata = new ObjectMetadata();
		objectMetadata.setContentLength(file.getSize());
		objectMetadata.setContentType(file.getContentType());

		try (InputStream inputStream = file.getInputStream()) {
			amazonS3.putObject(new PutObjectRequest(bucket, fileName, inputStream, objectMetadata).withCannedAcl(
				CannedAccessControlList.PublicRead));
		} catch (IOException e) {
			throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
		}

		return amazonS3.getUrl(bucket, fileName).toString();
	}

	// 파일명을 난수화하기 위해 UUID 를 활용하여 난수를 돌린다.
	public String createFileName(String fileName) {
		return UUID.randomUUID().toString().concat(getFileExtension(fileName));
	}

	//  "."의 존재 유무만 판단
	private String getFileExtension(String fileName) {
		try {
			return fileName.substring(fileName.lastIndexOf("."));
		} catch (StringIndexOutOfBoundsException e) {
			throw new CustomException(ErrorCode.INVALID_FILE_EXTENSION);
		}
	}

	public void deleteFile(String fileName) {
		amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
		System.out.println(bucket);
	}
}
