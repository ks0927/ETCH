package com.ssafy.etch.member.entity;

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

}
