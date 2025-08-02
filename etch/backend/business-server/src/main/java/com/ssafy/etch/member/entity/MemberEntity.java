package com.ssafy.etch.member.entity;

import com.ssafy.etch.member.dto.MemberDTO;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name="member")
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nickname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String phoneNumber;

    private String profile;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private LocalDate birth;

    @Enumerated(EnumType.STRING)
    private MemberRole role = MemberRole.GUEST;

    private boolean isDeleted = false;

    @Column(nullable = false)
    private String refreshToken;

//    @OneToMany(mappedBy = "user")
//    private List<AppliedJobEntity> appliedJobs = new ArrayList<>();
//
//    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL)
//    private List<FollowEntity> following = new ArrayList<>();
//
//    @OneToMany(mappedBy = "user")
//    private List<ProjectEntity> projects = new ArrayList<>();
//
//    @OneToMany(mappedBy = "user")
//    private List<CommentEntity> comments = new ArrayList<>();
//
//    @OneToMany(mappedBy = "user")
//    private List<LikedContentEntity> likedContents = new ArrayList<>();

    public MemberDTO toMemberDTO() {
        return MemberDTO.builder()
                .id(id)
                .nickname(nickname)
                .email(email)
                .phoneNumber(phoneNumber)
                .profile(profile)
                .gender(gender)
                .birth(String.valueOf(birth))
                .role(role.name())
                .isDeleted(isDeleted)
                .refreshToken(refreshToken)
                .build();
    }

    public static MemberEntity toMemberEntity(MemberDTO memberDTO) {
        MemberEntity memberEntity = new MemberEntity();
        if (memberDTO.getId() != null) {
            memberEntity.id = memberDTO.getId();
        }
        memberEntity.nickname = memberDTO.getNickname();
        memberEntity.email = memberDTO.getEmail();
        memberEntity.phoneNumber = memberDTO.getPhoneNumber();
        memberEntity.profile = memberDTO.getProfile();
        memberEntity.gender = memberDTO.getGender();
        memberEntity.birth = LocalDate.parse(memberDTO.getBirth());
        memberEntity.isDeleted = false;
        memberEntity.refreshToken = memberDTO.getRefreshToken();
        return memberEntity;
    }


    public static void updateRefreshToken(MemberEntity memberEntity, String refreshToken) {
        memberEntity.refreshToken = refreshToken;
    }
    public static void changeMemberStatus(MemberEntity memberEntity, boolean isDeleted) {
        memberEntity.isDeleted = isDeleted;
    }
}
