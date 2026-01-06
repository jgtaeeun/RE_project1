# RE_project1
### 프로젝트 목표
- 첫 백엔드 프로젝트를 통해 개발의 기초를 다졌지만, 완성도 면에서 아쉬움이 남았습니다. 과거의 코드를 다시 마주하며 부족했던 예외 처리나 데이터베이스 설계를 보수하는 과정을 통해 보다 나은 코드를 만드는 경험을 하고자 했습니다.
- 요양 병원 정보와 건강 데이터를 제공하는 기능은 사회적으로 꼭 필요한 정보라고 판단했고, 단순히 개발 연습에 그치지 않고 실제 배포를 통해 사용자들에게 도움을 주는 서비스를 만들고 싶어 고도화를 결정했습니다.

|주요목표|자질|
|:--:|:--:|
|코드 분석 및 리팩토링 (기본기)|기존의 불안정한 코드를 안정적으로 바꾸기 위해 테스트 환경을 구축|
|기능 확장 및 DB 설계 (설계 능력)|데이터 무결성을 위해 정규화를 진행 <br> 검색 기능 구현 시 인덱스(Index)를 어떻게 활용했는지<br> 알고리즘 추천 시 어떤 기준으로 쿼리를 최적화했는지|
|다중 접속 및 로그 분석 (고급 역량)|JMeter나 nGrinder 같은 도구로 부하 테스트 <br>단순 저장이 아니라, ELK 스택 등을 활용해 의미 있는 데이터를 추출 |

### 프로젝트 진행계획

|주차|계획|
|:--:|:--:|
|1주차|프론트 코드 페이지별 분석(홈화면, 마이페이지, 병원검색, 건강정보) <br> 백엔드 코드 기능별 분석(컨트롤러, 서비스, REPO, CONFIG) <br>  백엔드 코드 수정 (토큰로그인/OAUTH로그인/마이페이지/데이터베이스)|
|2주차|기능 추가(게시판글에서는 댓댓글기능, 페이지이동기능/건강정보 기능에서는 알고리즘 추천, 음성검색기능, 동영상첨부나 링크 연결) <br>  DB 기능 추가(로그인 시 개인정보 보안, 효율을 위한 테이블 연결, 외래키, OAUTH로그인 시 보안측면 고려)|
|3주차|다중접속, 사용자기록 로그 분석, AI 추천기능 추가|

### 1주차 진행상황 기록
#### 1일차(12/23)
- 프론트 코드 페이지별 분석

|페이지|프론트코드|백엔드코드|개선사항|
|:--:|:--:|:--:|:--:|
|로그인|유효성검사|회원정보 중복확인|토큰방식 로그인|
|마이페이지|찜하기|찜하기|테이블 정규화|
|병원검색|조건입력, 카카오맵연동|조건출력|데이터공백확인|
|건강백과사전|api데이터 활용|||
|게시판/qna|제목,작성자,내용 카테고리별 검색기능, 미리보기기능,  페이징기능, 날짜내림차순정렬|게시글 입출력,로그인유무||

- 백엔드 코드 기능별 분석(컨트롤러, 서비스, REPO, CONFIG)
  
```
project0819/src/main/java/edu/pnu
├── 📁 config
│   ├── CustomAuthenticationSuccessHandler.java  # OAuth2 로그인 성공 후 처리 로직
│   ├── CustomOAuth2UserService.java           # 구글 로그인 정보를 Member 테이블 규격에 맞게 변환
│   ├── JpaConfig.java                         # JpaTransactionManager 설정
│   └── SecurityConfig.java                    # CORS, 로그인/로그아웃, 세션 및 요청 권한 설정
├── 📁 controller
│   ├── BoardController.java                   # 게시글 및 댓글 CRUD API
│   ├── QnaController.java                     # Q&A 게시글 및 댓글 CRUD API
│   ├── CardDetailController.java              # 병원 조건 검색 및 요약 정보 리스트 조회
│   ├── FavoriteController.java                # 병원 찜하기/취소 및 즐겨찾기 목록 조회
│   ├── InformationController.java             # 지역·인력 조건 기반 병원 상세 검색
│   ├── LoginController.java                   # 일반/구글 로그인 처리 및 쿠키 관리
│   ├── MemberController.java                  # 회원가입 및 중복 회원 검증
│   └── SessionController.java                 # 로그인 상태 유지 체크 및 마이페이지 데이터
├── 📁 domain
│   ├── Board.java / BoardRe.java              # 게시판 및 댓글 엔티티
│   ├── Qna.java / QnaRe.java                  # Q&A 및 댓글 엔티티
│   ├── Sidosigungu.java                       # 시도/시군구 행정구역 정보
│   ├── Doctor.java / Person.java              # 병원 인력 및 관련 정보
│   ├── Information.java                       # 병원 기본 정보
│   ├── Level.java                             # 병원 등급
│   ├── Member.java                            # 회원 정보
│   ├── Favorites.java                         # 찜한 병원 (즐겨찾기)
│   └── LoginRequest.java                      # 로그인 요청 DTO
├── 📁 persistence
│   ├── BoardRepository.java                   # 게시판 데이터 접근
│   ├── BoardReRepository.java                 # 게시판 댓글 데이터 접근
│   ├── QnaRepository.java                     # Q&A 데이터 접근
│   ├── QnaReRepository.java                   # Q&A 댓글 데이터 접근
│   ├── SidosigunguRepository.java             # 행정구역 데이터 조회
│   ├── DoctorRepository.java                  # 의료진 데이터 조회
│   ├── PersonRepository.java                  # 인력 관련 데이터 조회
│   ├── InformationRepository.java             # 병원 정보 데이터 조회
│   ├── LevelRepository.java                   # 등급 데이터 조회
│   ├── MemberRepository.java                  # 회원 데이터 처리
│   └── FavoritesRepository.java               # 즐겨찾기 데이터 처리
└── 📁 service
    ├── BoardService.java                      # 게시판 비즈니스 로직
    ├── QnaService.java                        # Q&A 비즈니스 로직
    ├── InformationService.java                # 병원 정보 검색 및 필터링 로직
    ├── MemberService.java                     # 회원 가입 및 정보 관리
    ├── FavoriteService.java                   # 즐겨찾기 추가/삭제 로직
    └── LoginService.java                      # 비밀번호 암호화(BCrypt) 및 로그인 검증
```
#### 2일차(12/25)

- 계층형 아키텍처
  
|계층|역할|
|:--:|:--:|
|Domain |데이터베이스의 테이블과 1:1로 매핑되는 객체(Entity)|
|Repository|DB에 데이터를 저장, 조회, 수정, 삭제(CRUD)하는 작업을 수행합니다. <br> 스프링 데이터 JPA를 사용하면 인터페이스만 선언해도 구현체가 자동으로 생성됩니다. <br> 서비스(Service) 계층에서 요청을 받아 DB와 통신합니다.|
|Service|여러 레포지토리를 조합하거나, 복잡한 계산, 트랜잭션 처리를 담당합니다.<br>컨트롤러로부터 요청을 받아 비즈니스 로직을 수행한 후, 결과를 다시 컨트롤러에 넘겨줍니다.|
|Controller|사용자의 요청(HTTP Request)을 가장 먼저 받는 관문입니다.<br>클라이언트 ↔ 컨트롤러 ↔ 서비스.|
|Config (설정)|외부 라이브러리 설정<br>보안 설정(Spring Security)<br> CORS 설정<br>특정 빈(Bean)을 수동으로 등록할 때|

- 주요 계층별로 반드시 알아야 할 핵심 어노테이션
  - Controller
     
   |어노테이션|설명|
   |:--:|:--:|
   |@CrossOrigin(origins = "http://localhost:3000")| 다른 도메인으로 요청을 보내는 것을 기본적으로 차단합니다. |
   |@Controller|해당 클래스가 Spring MVC 컨트롤러임을 나타냅니다.<br> (View를 반환할 때 사용)|
   |@RestController| @Controller + @ResponseBody의 조합입니다.<br> 주로 JSON 형태로 데이터를 반환하는 REST API를 만들 때 사용합니다.|
   |@RequiredArgsConstructor| 생성자 주입(Constructor Injection) 자동화|
   |@RequestMapping| 특정 URL 패턴을 클래스나 메서드에 매핑합니다.|
   |@GetMapping<br> @PostMapping<br> @PutMapping<br> @DeleteMapping| HTTP Method(GET, POST, PUT, DELETE)에 맞게 요청을 처리합니다.|
   |@RequestBody|클라이언트가 보낸 JSON 데이터를 객체로 변환하여 받을 때 사용합니다.|

  - Service

   |어노테이션|설명|
   |:--:|:--:|
   |@Service|해당 클래스가 서비스 계층임을 명시하고, 스프링 빈(Bean)으로 등록합니다.|
   |@Transactional| 메서드 내의 작업들을 하나의 트랜잭션으로 묶어줍니다. <br>작업 중 오류가 발생하면 자동으로 롤백(Rollback)을 수행합니다.|

  - Repository
    
   |어노테이션|설명|
   |:--:|:--:|
   |@Repository| 해당 클래스가 데이터 저장소에 접근하는 클래스임을 명시합니다. <br> DB 예외를 스프링의 예외 계층으로 변환해주는 역할도 합니다.|

  - Domain

   |어노테이션|설명|
   |:--:|:--:|
   |@Entity| 이 클래스가 DB 테이블과 매핑될 클래스임을 나타냅니다. <br>(JPA 관리 대상)|
   |@Id| 테이블의 기본키(PK)를 지정합니다.|
   |@GeneratedValue|기본키 생성 전략을 설정합니다.|
   |@Table, @Column|테이블이나 컬럼의 이름을 실제 DB와 다르게 설정하고 싶을 때 사용합니다.|
   |@Getter / @Setter| Domain(Entity) 클래스에서 필드에 대한 Getter/Setter 메서드를 생성해줍니다.|
   |@NoArgsConstructor| 파라미터가 없는 기본 생성자를 만들어줍니다. (JPA Entity에는 필수입니다.)|
   |@AllArgsConstructor|모든 필드를 파라미터로 받는 생성자를 만들어줍니다.|
      
  - Config

   |어노테이션|설명|
   |:--:|:--:|
   |@Configuration|해당 클래스가 스프링의 설정 정보임을 나타냅니다.|
   |@Bean| 메서드가 반환하는 객체를 스프링 컨테이너에 빈으로 등록합니다. <br> 주로 외부 라이브러리 객체를 등록할 때 씁니다.|

- 보충 설명
  1. JpaRepository
     - 클래스가 아니라 인터페이스입니다. JpaRepository<Entity클래스, ID타입>을 상속받기만 하면 실체(구현체)는 스프링이 알아서 만들어줍니다.
     - INSERT, UPDATE, SELECT, DELETE 같은 뻔한 SQL을 직접 작성할 필요가 없습니다.
     - Repository 
      ```java
      import org.springframework.data.jpa.repository.JpaRepository;
      import org.springframework.data.jpa.repository.Query;
      
      import edu.pnu.domain.Member;
      
      public interface MemberRepository extends JpaRepository <Member, String>{
      	Member findByUsernameAndPassword(String username, String password);
      	Member findByEmail(String email);
      }
      ```

     - Service
      ```java
      @Service
      public class MemberService {
        @Autowired
        private  MemberRepository  memberRepo;
     
        public List<Member> getAllMembers() {
          return  memberRepo.findAll();
        }
      }
      ```
    
  2. @Bean
     - 보통 SecurityFilterChain이나 PasswordEncoder 같은 객체를 만들 때 사용합니다.
     - 스프링이 만들고 관리하는 객체
     - 스프링에게 이 객체의 생명주기(생성, 관리, 소멸)를 네가 담당해줘라고 권한을 넘기는 것이라고 이해하시면 됩니다.
     - config
      ```java
       @Configuration
       @EnableWebSecurity
       public class SecurityConfig  {
  
    	   @Bean
    	   PasswordEncoder passwordEncoder() {
    	     return new BCryptPasswordEncoder();
    	   }
       }
      ```
     - service
      ```java
       @Service
       public class LoginService {
         @Autowired
         private PasswordEncoder passwordEncoder;
       }
      ```
  3. @RequiredArgsConstructor
    - final이 붙거나 @NonNull이 붙은 필드(변수)들을 파라미터로 받는 생성자를 자동으로 만들어줍니다.
    - @Autowired를 일일이 붙이지 않아도 깔끔하게 의존성 주입이 완료됩니다.

- **개선사항**
  - 컨트롤러 계층에서 @CrossOrigin(origins = "http://localhost:3000") 대신에 WebMvcConfigurer를 이용해 Config 계층에서 한 번에 설정
  - 컨트롤러 계층에서 @RequiredArgsConstructor 태그 있을 경우 ,  private final BoardService boardService와 같이 final 처리로 생성자 생략 
  - 로그인 관련 추가 -   - 토큰방식 로그인 처리방식 /oauth로그인 기능 코드 /유효성 검사 코드
    
#### 3일차(12/29)
- 프론트코드(LoginForm.js)
  1. 유효성검사
    - 프론트엔드 검사 (UX 향상용):
      - 사용자가 데이터를 서버로 보내기 전에 즉각적인 피드백을 주기 위해 합니다.
      - 서버까지 데이터가 갔다 오는 시간을 아껴주어 사용자 경험을 좋게 만듭니다.
      - 하지만 보안상 취약합니다. (사용자가 브라우저 개발자 도구로 검사 로직을 우회할 수 있기 때문입니다.)
    - 백엔드 검사 (보안/데이터 무결성용):
      - 최후의 보루입니다. 프론트엔드에서 우회해서 들어온 잘못된 값이나 악의적인 데이터를 차단합니다.
      - 백엔드 검사가 없으면 데이터베이스에 쓰레기 데이터가 쌓이거나 보안 사고가 날 수 있습니다.


  2. 비밀번호 조건 국룰 조합
    - 보통 웹사이트들이 까다롭게 구는 이유는 **무차별 대입 공격(Brute Force Attack)**을 방어하기 위해서입니다.
    - 길이: 최소 8자 이상 (최근엔 10~12자 이상 권장)
    - 조합: 영문 대문자, 소문자, 숫자, 특수문자 중 3종류 이상 조합
    - 제한: 아이디와 동일한 비밀번호, 1234 같은 연속 숫자, 생일 등 제외
    ```js
    const validateField = (name, value) => {
    let errorMsg = null;
  
    if (name === 'password') {
      // 8자 이상, 최소 하나의 숫자 및 특수문자 포함 규칙
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      
      if (!value) {
        errorMsg = '비밀번호를 입력하세요.';
      } else if (!passwordRegex.test(value)) {
        errorMsg = '비밀번호는 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.';
      }
    }
    
    setErrors(prevErrors => ({ ...prevErrors, [name]: errorMsg }));
    };
    ```
  3. **개선사항**
    - 유효성검사 조건
    - 토큰방식 로그인 처리방식 - left .js . LoginForm.js , SignUp.js
    - 비동기 에러 상태 동기화: handleSubmit에서 validateField를 호출할 때, setErrors는 비동기로 작동하므로 if (Object.values(errors).some(...)) 체크 시점에서 최신 에러 상태가 반영되지 않을 수 있습니다. 제출 시에는 별도의 로컬 변수로 검사하는 것이 더 안전합니다.
    - 소셜 로그인 기능: 현재 구글, 네이버 등 버튼은 UI만 있고 기능은 없습니다. 나중에 OAuth 기능을 추가하실 계획이라면 해당 버튼에 onClick 핸들러를 연결하시면 됩니다.
    - Loading 상태: 서버 응답을 기다리는 동안 버튼을 비활성화하거나 로딩 스피너를 보여주면 사용자 경험(UX)이 더 좋아집니다.


#### 4일차(1/6)
1. 프론트코드 개선사항
- 로그인
  - 보안 및 안정성 개선
    - 로그인 중 중복 클릭 방지: 현재는 버튼을 여러 번 누르면 서버에 요청이 동시에 여러 번 날아갑니다. loading 상태를 추가해 요청 중에는 버튼을 비활성화하는 것이 좋습니다.
    - 비밀번호 가시성 토글: 사용자가 비밀번호를 입력할 때 오타를 확인할 수 있도록 눈 모양 아이콘을 넣어 비밀번호를 보거나 숨길 수 있게 하면 UX가 크게 개선됩니다.
  - 코드 로직 및 UX 개선
    - 세션방식을 토큰방식으로
    - oauth로그인 기능 코드
    - 유효성검사조건(비밀번호국룰)
    - 입력값 공백 제거: 이메일 입력 시 앞뒤에 실수로 들어간 공백 때문에 로그인이 실패하는 경우가 많습니다. formData.email.trim() 처리를 추천합니다.
    - 비동기에러상태동기화
    - 로딩상태
    - 로그인 유지: 로그인이 성공했을 때 브라우저의 쿠키나 localStorage에 정보를 저장하는 로직이 onLoginSuccess 내부에 잘 구현되어 있는지 확인해 보세요.
- 카드정보
  - 기능적 완성도 (Stability)
    - 데이터 예외 처리 (Optional Chaining): CardDetail에서 cardDetails.specialistInfo.split(' ')을 사용 중인데, 만약 서버에서 데이터가 비어있거나(null) 형식이 다르면 화면 전체가 하얗게 변하며 멈출 수 있습니다.
    - 개선: cardDetails.specialistInfo?.split(' ') || [] 처럼 안전장치를 추가하세요.
  - 사용자 경험 (UX/UI)
    - 검색 결과 "0건"일 때의 피드백: List.js에서 결과가 없을 때 단순히 "검색 결과가 없습니다"만 보여주기보다, **"조건을 변경해서 다시 검색해보세요"**라는 문구와 함께 [다시 검색하기] 버튼을 배치하면 사용자가 이탈하지 않습니다.
    - 로딩 스피너 (Loading Spinner): API 요청 중에는 Loading... 글자 대신 회전하는 아이콘(Spinner)이나 데이터 모양의 틀(Skeleton)을 보여주면 앱이 훨씬 전문적으로 보입니다.
    - 상세 페이지 "뒤로가기": CardDetail에 목록으로 돌아가는 버튼이 없습니다. 브라우저 뒤로가기를 쓸 수도 있지만, 화면 상단에 < 목록으로 돌아가기 버튼을 배치하는 것이 친절합니다.
  - 코드 구조 및 성능 (Engineering)
    - URL 인코딩 관리: List.js에서 쿼리 파라미터를 만들 때 encodeURIComponent를 직접 쓰고 계신데, URLSearchParams 객체를 활용하면 한글 인코딩을 자동으로 안전하게 처리해 줍니다.
    - 컴포넌트 분리: CardDetail.js 내부의 지도 로직이 상당히 깁니다. 나중에 다른 곳에서도 지도를 쓸 수 있으니 KakaoMap.js 같은 별도 컴포넌트로 분리하면 코드가 훨씬 읽기 쉬워집니다.
    - 중복 Fetch 줄이기: CardDetail에서 fetchCardDetails와 fetchFavorites가 각각 돌고 있습니다. 만약 백엔드 수정이 가능하다면, 병원 상세 정보를 가져올 때 현재 사용자의 찜 여부까지 한 번에 담아서 내려주는 것이 효율적입니다.
- 건강백과사전
  - 이미지추가
  - 특정 단어를 찾는 검색 기능

- 게시판
  - 보안 및 UX: ComDetail.js 버튼 노출 제어
    - 현재 코드에서는 작성자가 아니더라도 '글 수정하기', '글 삭제' 버튼이 보입니다. 클릭하면 alert이 뜨긴 하지만, 자신의 글이 아닐 때는 버튼 자체가 안 보이게 하는 것이 더 직관적입니다.
  - 성능 최적화: useEffect 의존성 관리
    - Community.js에서 검색 필터링을 하는 로직(filteredBoards)은 boards가 바뀔 때마다 실행됩니다. 데이터가 많아질 경우를 대비해 useMemo를 사용하면 불필요한 재계산을 막을 수 있습니다.
  - 실시간 검색 대응 (Debouncing)
    - 현재는 검색창에 글자 하나를 칠 때마다 필터링이 일어납니다. 데이터가 많으면 타자가 버벅일 수 있습니다.
    - 팁: 사용자가 입력을 멈춘 뒤 0.3초 후에 검색이 실행되도록 하는 Debouncing 기술을 적용해 보세요.
  - 에러 핸들링 및 빈 상태 UI
    - 게시글이 하나도 없을 때 단순히 빈 테이블만 보이는 것보다 친절한 안내가 필요합니다.
  - ComWrite.js 등록 중 중복 클릭 방지
    - 네트워크가 느릴 때 사용자가 '등록하기' 버튼을 여러 번 누르면 게시글이 여러 개 생성될 수 있습니다.
    - 개선안: isSubmitting 상태를 만들어 버튼을 비활성화하세요.
  - 추가로 고려할 만한 기능
    - 조회수 증가 로직: 현재 cnt 필드가 있는데, 상세 페이지(ComDetail)에 진입할 때마다 서버에 조회수 증가 요청(PUT 또는 PATCH)을 보내는 로직이 있으면 완벽합니다.
    - 댓글 삭제: 작성한 댓글을 삭제할 수 있는 기능도 추가하면 사용자들이 더 좋아할 것 같습니다.
    - 내용 줄바꿈: ComDetail에서 게시글 본문을 보여줄 때 white-space: pre-wrap; 스타일을 주어야 사용자가 입력한 줄바꿈이 화면에 그대로 나타납니다.
- 큐엔에이
  - QnA 목록 페이지 (Qna.js) 개선
    - N+1 문제 해결 (성능 최적화): 현재 fetchQnas에서 게시글 목록을 가져온 뒤, 각 게시글마다 map을 돌며 답변을 개별 호출(fetch)하고 있습니다. 게시글이 50개라면 50번의 추가 통신이 발생하여 로딩이 매우 느려집니다.
    - 해결책: 백엔드 API를 수정하여 /qna 호출 시 답변(Replies) 데이터가 포함된 채로 내려오게 하거나(Join 처리), 답변 개수만 먼저 보여주고 상세 페이지에서 데이터를 로딩하는 방식을 추천합니다.
    - 답변 유무 표시: 목록에서 답변 내용 전체를 보여주기보다, 제목 옆에 [답변완료] 태그나 답변 개수를 표시하는 것이 시각적으로 더 깔끔합니다.
  - QnA 상세 페이지 (QnaDetail.js) 개선
    - 삭제 권한 로직 보완: 현재는 admin만 삭제 가능하도록 되어 있습니다. 보통 QnA는 **'관리자'**와 '본인(작성자)' 모두 삭제할 수 있어야 합니다.
    - 개선: qna.member.username === user인 경우에도 삭제 버튼이 보이도록 조건을 추가해 보세요.
    - 비밀글 기능 (선택 사항): 질문 내용에 개인적인 정보가 포함될 수 있으므로, 작성 시 '비밀글 설정' 체크박스를 만들고 작성자와 관리자만 볼 수 있게 제한하는 기능을 고려해 보세요.
  - 추가 체크리스트
    - 에러 핸들링: fetch 요청 시 실패했을 때(response.ok가 아닐 때) 사용자에게 alert나 토스트 메시지로 정확한 실패 원인을 알려주면 좋습니다.
    - 입력값 검증: 질문 작성 시 제목이나 내용이 너무 짧거나 공백일 경우 trim().length 체크를 통해 등록을 막아주세요.
    - 날짜 형식 통일: Qna.js와 QnaDetail.js에서 사용하는 날짜 포맷 함수가 중복되는데, 이를 utils/dateUtils.js 같은 공통 파일로 빼서 관리하면 코드가 훨씬 깔끔해집니다.
- 마이페이지
  - UX 및 기능적 개선
    - 찜 해제 시 사용자 확인: 지금은 하트를 누르면 즉시 삭제됩니다. 실수로 누를 수도 있으니 간단한 확인 창을 띄우거나, 삭제 직후 "찜 목록에서 삭제되었습니다"라는 토스트 알림을 보여주는 것이 좋습니다.
    - 빈 상태(Empty State) 디자인 보강: 현재는 "작성한 글이 없습니다"라는 텍스트만 나옵니다. 여기에 **[병원 검색하러 가기]**나 [커뮤니티에 글 쓰러 가기] 같은 버튼(CTA)을 배치하면 사용자의 다음 행동을 유도할 수 있습니다.
  - 코드 및 성능 최적화
    - API 호출 병렬화: fetchData 함수 안에서 await checkSession(), await fetch('...mypage'), await fetchFavorites()가 순차적으로 실행되고 있습니다. 세션 확인 후 데이터 로딩은 Promise.all을 사용하여 동시에 처리하면 페이지 로딩 속도가 빨라집니다.

2. 백엔드 코드 개선사항
- 백엔드 코드 리뷰 주요 포인트
  - RESTful API 설계: URL 경로(@RequestMapping)와 HTTP Method(GET, POST, PUT, DELETE)가 용도에 맞게 적절히 사용되었는지 확인합니다.
  - DTO 활용: 엔티티(Entity)를 외부로 직접 노출하지 않고, 요청과 응답에 전용 DTO를 사용하고 있는지 체크합니다.
  - 예외 처리 (Global Exception Handling): 비즈니스 로직 중 발생하는 에러를 어떻게 처리하고 클라이언트에게 어떤 상태 코드(ResponseEntity)를 주는지 확인합니다.
  - 트랜잭션 관리: @Transactional이 서비스 계층에서 데이터 일관성을 위해 적절히 배치되었는지 확인합니다.
  - 보안 및 인증: 세션/쿠키 처리나 관리자 권한(admin) 체크 로직이 서비스 레이어에서 안전하게 검증되는지 봅니다.

- 공통
  - DTO 적용 (Entity 노출 방지)
  ```java
  // BoardResponseDto.java
  @Getter
  @AllArgsConstructor
  public class BoardResponseDto {
      private Long boardId;
      private String title;
      private String content;
      private String writer; // Member 엔티티 대신 이름만 추출
      private Long cnt;
      private Date createDate;
  
      // Entity를 DTO로 변환하는 생성자
      public BoardResponseDto(Board board) {
          this.boardId = board.getBoardId();
          this.title = board.getTitle();
          this.content = board.getContent();
          this.writer = board.getMember().getUsername();
          this.cnt = board.getCnt();
          this.createDate = board.getCreateDate();
      }
  }
  ```
  - 서비스 계층 개선 (Optional & Dirty Checking)
    - throws SQLException을 제거하고 더 현대적인 방식으로 수정했습니다.
  ```java
  @Service
  @RequiredArgsConstructor // Autowired 대신 생성자 주입 권장
  public class BoardService {
  
      private final BoardRepository boardRepo;
  
      @Transactional(readOnly = true) // 단순 조회 시 성능 향상
      public Board getBoard(Long id) {
          return boardRepo.findById(id)
              .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
      }
  
      @Transactional
      public void updateBoard(Member member, Board boardDto, Long id) {
          // 1. 조회 (영속화)
          Board target = boardRepo.findById(id)
              .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));
  
          // 2. 권한 확인
          if (!target.getMember().getUsername().equals(member.getUsername())) {
              throw new RuntimeException("수정 권한이 없습니다.");
          }
  
          // 3. 필드 업데이트 (Dirty Checking 발생)
          if (boardDto.getTitle() != null) target.setTitle(boardDto.getTitle());
          if (boardDto.getContent() != null) target.setContent(boardDto.getContent());
          
          // 별도의 save() 호출이 없어도 트랜잭션 종료 시 자동 업데이트됩니다.
      }
  }
  ```
  - 컨트롤러 개선 (ResponseEntity 활용)
    - 로직을 서비스로 밀어넣고 컨트롤러는 응답 방식에만 집중합니다.
  ```Java
  @GetMapping("/{id}")
  public ResponseEntity<BoardResponseDto> getBoard(@PathVariable Long id) {
    // 1. 서비스에서 데이터 가져오기 (예외는 GlobalExceptionHandler에서 처리하면 더 깔끔합니다)
    Board board = boardService.getBoard(id);
    
    // 2. 조회수 증가는 서비스 내 별도 메서드로 처리하는 것을 추천
    boardService.increaseViewCount(id); 
    
    // 3. DTO로 변환하여 반환
    return ResponseEntity.ok(new BoardResponseDto(board));
  }
  ```
- 왜 이렇게 바꿀까요?
  - 보안: Member 엔티티 안에 들어있는 비밀번호 등이 API 응답에 섞여 나가는 것을 원천 봉쇄합니다.
  - 성능: readOnly = true를 통해 JPA의 스냅샷 관리를 최적화할 수 있습니다.
  - 가독성: updateBoard의 복잡한 if-else가 사라지고 비즈니스 흐름이 명확해집니다.
- 게시판
  - Optional 안전하게 처리하기 (.get() 사용 지양)
    - 현재 서비스 코드에서 boardRepo.findById(id).get()을 사용하고 계신데, 만약 데이터베이스에 해당 ID가 없으면 NoSuchElementException이 발생하며 서버가 500 에러를 뱉게 됩니다.
    - 개선: orElseThrow를 사용하여 데이터가 없을 때 명확한 예외를 던지거나 처리해야 합니다.
    ```Java
    // 개선 전
    Board board = boardRepo.findById(id).get();
    // 개선 후
    Board board = boardRepo.findById(id)
      .orElseThrow(() -> new RuntimeException("해당 게시글을 찾을 수 없습니다."));
    ```
  - 조회수 증가 로직 최적화
    - 현재 Controller에서 게시글을 가져온 뒤 다시 setCnt를 하고 updateBoard를 호출하고 있습니다. 이는 한 번의 요청에 SELECT와 UPDATE 쿼리가 따로 발생하며, 로직이 컨트롤러에 분산되어 있습니다.
    - 개선: 서비스 계층에 @Transactional을 건 increaseViewCount 같은 메서드를 만들어 비즈니스 로직을 캡슐화하세요. (참고: 벌크 연산 @Query("update Board b set b.cnt = b.cnt + 1 where b.id = :id")을 사용하면 성능이 더 좋아집니다.)

  - 더티 체킹(Dirty Checking) 활용
    - JPA는 영속성 컨텍스트 덕분에 엔티티의 필드 값만 바꿔도 트랜잭션 종료 시점에 변경 사항을 감지해서 UPDATE 쿼리를 날립니다. 현재 updateBoard 메서드에서 여러 조건문(if-else if)과 save()를 반복하는 코드를 단순화할 수 있습니다.
    - 개선: 엔티티 내부에 update 메서드를 만들면 코드가 훨씬 읽기 쉬워집니다.
    ```Java
    // Board 서비스 내부
    @Transactional
    public void updateBoard(Member member, Board board, Long id) throws SQLException {
        Board target = boardRepo.findById(id).orElseThrow(...);
        
        if (target.getMember().getUsername().equals(member.getUsername())) {
            // null이 아닐 때만 업데이트 (Dirty Checking)
            if (board.getTitle() != null) target.setTitle(board.getTitle());
            if (board.getContent() != null) target.setContent(board.getContent());
            // boardRepo.save(target); 호출 필요 없음 (트랜잭션 종료 시 자동 반영)
        }
    }
    ```
  
  - 추가적인 팁
    - SQLException 제거: JPA 환경에서는 대부분 RuntimeException 계열의 예외가 발생하므로 메서드마다 throws SQLException을 붙이지 않아도 자동으로 Spring이 예외 변환을 해줍니다. 코드가 훨씬 간결해집니다.
    - 삭제 로직: deleteByBoardId(id) 같은 메서드를 호출할 때, Board와 BoardRe가 Cascade(영속성 전이) 관계라면 boardRepo.delete(board)만 호출해도 댓글까지 한꺼번에 지울 수 있습니다.
- 큐엔에이
  - 예외 처리 방식 개선 (Optional 활용)
    - 현재 qnaRepo.findById(id).get()을 사용하고 있는데, 만약 해당 ID의 데이터가 없으면 NoSuchElementException이 발생합니다.
    - 개선: Optional의 orElseThrow를 사용하여 명확한 예외를 던지거나, Service 레이어에서 데이터 존재 여부를 안전하게 체크해야 합니다.
    - 영향: 서버가 예상치 못한 런타임 에러로 중단되는 것을 방지합니다.
  - 권한 검증 로직의 일관성
    - Controller에서 member.getRole()을 직접 체크하거나, Service에서 작성자 일치 여부를 체크하는 로직이 섞여 있습니다.
    - 개선: * 삭제 권한: 현재 코드에서는 member 역할이면 삭제를 막고 있습니다. 보통은 '작성자 본인'이거나 '관리자'인 경우 삭제를 허용하도록 로직을 정교화하는 것이 좋습니다.
    - 수정 권한: updateQna 시 본인이 아니면 아무런 에러 응답 없이 조용히 넘어갑니다. 실패 시 사용자에게 알림을 줄 수 있도록 예외를 던지는 것이 좋습니다.
  - 계층 간 데이터 전달 (DTO 도입)
    - 현재 Entity(Qna, QnaRe)를 그대로 컨트롤러에서 받고 응답하고 있습니다.
    - 개선: QnaRequestDTO, QnaResponseDTO를 만들어 필요한 데이터만 주고받으세요.
    - 이유: Entity에는 DB 연관 관계(Member 등)가 복잡하게 얽혀 있어, JSON으로 변환할 때 **순환 참조(Infinite Recursion)**가 발생하거나 불필요한 개인정보가 노출될 위험이 있습니다.
  - 코드 가독성 및 효율성
    - @Autowired 대신 생성자 주입(@RequiredArgsConstructor 이미 사용 중이므로 활용)을 권장합니다.
    - SQLException은 보통 JDBC 레벨에서 발생합니다. Spring Data JPA를 사용 중이라면 JPA 예외가 발생하므로, 굳이 모든 메서드에 throws SQLException을 붙일 필요가 없습니다.
  - 추가 제안 사항 (Architecture)
    - GlobalExceptionHandler 도입: @RestControllerAdvice를 사용하여 모든 컨트롤러의 try-catch 문을 제거하고 공통으로 예외를 처리하세요. 코드가 훨씬 깨끗해집니다.
    - Soft Delete 고려: 데이터를 실제로 DB에서 delete 하기보다 is_deleted 같은 컬럼을 두어 관리하는 것이 데이터 복구 측면에서 유리합니다.
    - Spring Security: 현재 @SessionAttribute를 사용 중인데, 추후 프로젝트 규모가 커지면 Spring Security를 도입하여 권한 처리를 선언적으로(@PreAuthorize) 관리하는 것을 추천합니다.
- 마이페이지
  - N+1 문제 및 루프 내 DB 조회 최적화
    - 현재 getFavorites 메서드는 즐겨찾기 목록만큼 루프를 돌며 informationService.getHospitalListFromLevel(code)를 호출하고 있습니다. 즐겨찾기가 20개라면 20번의 쿼리가 발생합니다.
    - 개선: favoriteRepository에서 병원 코드 리스트를 가져온 후, JPA의 IN 절을 사용하여 단 한 번의 쿼리로 병원 정보를 모두 가져와야 합니다.
  - 서비스 계층의 책임 분리
    - 현재 컨트롤러가 Level 객체를 직접 조작하여 Map으로 변환하는 로직을 가지고 있습니다.
    - 개선: 이 변환 로직은 DTO(Data Transfer Object) 내부나 별도의 Mapper 클래스로 이동시켜 컨트롤러를 가볍게 만들어야 합니다.
  - 즐겨찾기 중복 체크 최적화 (Service)
    - addFavorite에서 기존 리스트를 모두 가져와 contains로 체크하고 있습니다.
    - 개선: DB 레벨에서 중복을 체크하거나(existsBy...), 엔티티에 복합 유니크 제약 조건을 걸어 예외 처리를 하는 것이 더 효율적입니다.
- 병원검색
  - 데이터베이스 접근 효율화 (N+1 문제 해결)
    - 가장 큰 개선 포인트는 getInformation 메서드 내의 루프(Loop) 호출입니다.
    - 문제점: for (String code : informationList1) 루프 안에서 informationService.getHospitalListFromLevel(code)를 매번 호출하고 있습니다. 만약 병원이 100개라면 100번의 DB 쿼리가 발생합니다.
    - 개선: List<String> codes를 한 번에 넘겨서 IN 절을 사용하는 쿼리(findAllByHospitalCodeIn)로 변경하세요.
    - 효과: 네트워크 오버헤드가 획기적으로 줄어들고 응답 속도가 빨라집니다.
  - 서비스 레이어의 로직 최적화 (교집합 계산)
    - 의사(Doctor)와 인력(Person) 필터링 시 현재 for 루프를 돌며 개별 쿼리를 날린 후 자바 코드에서 retainAll로 교집합을 구하고 있습니다.
    - 문제점: 데이터가 많아질수록 DB 부하가 커지고 자바 메모리 사용량이 늘어납니다.
    - 개선: 여러 조건을 AND 또는 IN 절로 묶은 하나의 복합 쿼리로 작성하거나, Querydsl을 사용하여 동적 쿼리를 생성하세요.
    - 특이 로직 처리: "외과" 선택 시 "정형외과"를 제외하는 로직도 DB의 EXCEPT 또는 NOT IN 절을 사용하면 훨씬 깔끔합니다.
    ```java
    @Transactional(readOnly = true)
    public List<HospitalResponseDTO> getHospitalDetails(List<String> codes) {
        // Repository에 findByHospitalCodeIn(codes) 정의 필요
        List<Level> levels = levelRepo.findByHospitalCodeIn(codes); 
        return levels.stream()
                     .map(HospitalResponseDTO::from)
                     .collect(Collectors.toList());
    }
    ```
  - 컨트롤러 응답 구조 개선 (DTO 도입)
    - 컨트롤러에서 Map<String, Object>를 수동으로 만들어서 데이터를 put하고 있습니다.
    - 문제점: 오타 발생 위험이 크고, API 문서화가 어렵습니다.
    - 개선: HospitalResponseDTO 클래스를 만드세요. tmpLevel.getInformation()에서 데이터를 추출하는 과정을 DTO의 생성자나 MapStruct 같은 라이브러리에 맡기면 컨트롤러 코드가 5줄 이내로 줄어듭니다.
    ```java
    @GetMapping("/list")
    public ResponseEntity<Map<String, List<HospitalResponseDTO>>> getInformation(...) {
        
        // 1. 위치 코드 리스트 확보
        String finalSido = informationService.getlocation(sido);
        String finalSigungu = informationService.getlocation2(sigungu);
        List<String> baseCodes = informationService.getCodeList(finalSido, finalSigungu);
    
        // 2. 필터링 (의사, 인력 조건 적용 - 서비스 내부에서 처리 권장)
        List<String> filteredCodes = informationService.filterHospitalCodes(baseCodes, doctor, person);
    
        if (filteredCodes.isEmpty()) return ResponseEntity.notFound().build();
    
        // 3. 한 번의 쿼리로 상세 정보 가져오기
        List<HospitalResponseDTO> hospitalList = informationService.getHospitalDetails(filteredCodes);
    
        Map<String, List<HospitalResponseDTO>> response = new HashMap<>();
        response.put("1", hospitalList);
        return ResponseEntity.ok(response);
    }
    ```
    ```java
    @Data
    @AllArgsConstructor
    public class HospitalResponseDTO {
        private Long num;
        private String level;
        private String id;
        private String name;
        private String address;
        private String phone;
        private Double locx;
        private Double locy;
        // ... 필요한 필드들
    
        public static HospitalResponseDTO from(Level level) {
            Information info = level.getInformation();
            return new HospitalResponseDTO(
                info.getNum(), level.getLevel(), info.getHospitalCode(),
                info.getHosName(), info.getLocation(), info.getPhonenum(),
                info.getLocx(), info.getLocy()
            );
        }
    }
    ```
  - 기타
    - Null Safety: List<String> doctor 등이 null일 경우를 대비해 Optional이나 Stream의 빈 처리를 더 견고하게 만드세요.
    - Transaction Read-Only: 조회만 하는 메서드에는 @Transactional(readOnly = true)를 붙여 성능을 최적화하세요.
- 로그인
  - 토큰 방식 전환 시 주요 변경점
    - 인증 정보 획득: @SessionAttribute("user") Member member 대신 @AuthenticationPrincipal (Spring Security 제공) 또는 토큰을 파싱하여 얻은 Principal을 사용합니다.
    - 보안성: 이제 서버 세션에 의존하지 않으므로, 클라이언트가 HTTP 헤더에 Authorization: Bearer <TOKEN>을 실어 보내야 합니다.
  - 세션 → 토큰(JWT) 전환 전략
    - 로그인(signin): 성공 시 session.setAttribute 대신, JWT 토큰을 생성하여 응답 바디(JSON) 또는 HttpOnly 쿠키에 담아 반환해야 합니다.
    - 로그아웃(signout): 서버 세션을 무효화하는 대신, 클라이언트의 저장소(LocalStorage)에서 토큰을 삭제하거나, 쿠키를 만료시켜야 합니다.
    - 인증 확인: 이후 모든 요청은 헤더(Authorization: Bearer <token>)를 통해 토큰을 전달받고, 서버는 Filter에서 이를 검증합니다.
  - 로그아웃 로직의 일관성 및 중복 제거
    - 현재 로그아웃 코드에서 JSESSIONID 쿠키를 삭제하는 로직이 두 번 반복되고 있습니다. 또한, 응답을 보내기 전에 리다이렉트를 호출하면 ResponseEntity 응답이 제대로 전달되지 않을 수 있습니다.
    - 개선: 쿠키 삭제 로직을 유틸리티 메서드로 분리하고, 리다이렉트와 JSON 응답 중 하나만 선택하세요. (REST API라면 상태 코드만 주는 것이 관례입니다.)
      ```java
      @PostMapping("/signout")
      public ResponseEntity<Void> signout(HttpServletRequest request, HttpServletResponse response) {
          // 1. 세션 무효화 (토큰 도입 전 과도기)
          HttpSession session = request.getSession(false);
          if (session != null) session.invalidate();
      
          // 2. 쿠키 만료 처리 (유틸화)
          expireCookie(response, "JSESSIONID");
          expireCookie(response, "googleLoggedIn");
      
          // 3. 브라우저 캐시 방지 설정
          response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
          
          return ResponseEntity.ok().build();
      }
      
      private void expireCookie(HttpServletResponse response, String name) {
          Cookie cookie = new Cookie(name, null);
          cookie.setPath("/");
          cookie.setMaxAge(0);
          response.addCookie(cookie);
      }
      ```
  - 비밀번호 비교 로직의 보안 (LoginService)
    - 현재 authenticate 메서드 내부에 System.out.println으로 비밀번호를 출력하고 있습니다.
    - 위험: 로그 파일에 사용자의 비밀번호가 평문으로 남을 수 있습니다. 운영 환경에서는 절대 금지 사항입니다.
    - 개선: 로그를 모두 제거하고 passwordEncoder.matches() 결과만 활용하세요.
  - 멤버 존재 여부 확인 (Optional 활용)
    - LoginService에서 member == null 체크를 수동으로 하고 있습니다.
    - 개선: Repository에서 Optional<Member>를 반환하게 하여 가독성을 높이세요.
  - 향후 로드맵 제안
    - Spring Security 설정: SecurityConfig에서 세션 정책을 STATELESS로 변경해야 합니다.
    - JWT Filter 구현: 모든 요청의 헤더에서 토큰을 추출하고 유효성을 검사하는 OncePerRequestFilter를 만듭니다.
    - Exception Handling: 로그인 실패 시 단순히 500 에러가 아닌, 401 Unauthorized와 함께 구체적인 에러 메시지({ "message": "Invalid password" })를 반환하는 전역 예외 처리기를 구축하세요.
  - 백엔드 단독 회원정보 중복확인
  - oauth로그인 기능 코드
- CONFIG
  - 컨트롤러 계층에서 @CrossOrigin(origins = "http://localhost:3000") 대신에 WebMvcConfigurer를 이용해 Config 계층에서 한 번에 설정
  - 컨트롤러 계층에서 @RequiredArgsConstructor 태그 있을 경우 , private final BoardService boardService와 같이 final 처리로 생성자 생략
- 병원정보 테이블 공백확인, 정규화
  

  
### 2주차 진행상황 기록


### 3주차 진행상황 기록
