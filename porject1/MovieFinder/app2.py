from flask import Flask, render_template, jsonify, request, redirect, session, escape
import requests
from selenium import webdriver
from pymongo import MongoClient
from datetime import datetime

options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('window-size=1920x1080')
options.add_argument("disable-gpu")

# UserAgent값을 바꿔줍시다!
options.add_argument(
    "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36")

app = Flask(__name__)
app.secret_key = "ABCDEFG"

client = MongoClient('mongodb://test:test@54.180.154.192', 27017)
db = client.moviefinder


# index_page 이동
@app.route('/')
def index_page():
    return render_template('index.html')


# register_page 이동
@app.route('/register', methods=['GET'])
def register_page():
    return render_template('html/register.html')


# recovery_page 이동
@app.route('/recovery', methods=['GET'])
def recovery_page():
    return render_template('html/recovery.html')


# dashboard_page 이동
@app.route('/dashboard', methods=['GET'])
def dashboard_page():
    name = session.get('username')
    email = session.get('useremail')

    movieResult = list(db.movieComment.find({'email': email}, {'_id': False}))
    privacyResult = list(db.privacyMovie.find({'email': email}, {'_id': False}).sort('date', -1))
    print(movieResult)
    print(privacyResult)

    # 고유값은 email로 설정
    # 받아온값
    print(" 받아온 이름:" + name)

    # 해당 아이디의 총 댓글수를 가져옴
    cnt = 0;

    if not movieResult == []:
        for n in movieResult:
            cnt += 1;

    print(cnt)
    # 최근본 영화 기록수 가져옴
    pcnt = 0;
    if not privacyResult == []:
        for n in privacyResult:
            pcnt += 1;

    print(pcnt)

    print("로그인후 배열")
    # print(privacyResult[0])

    level = "일반 회원"
    if (cnt > 30):
        level = "골드 회원"
    elif (cnt > 20):
        level = "실버 회원"
    elif (cnt > 10):
        level = "브론즈 회원"

    # 값이 1개이상 5개 미만 있을때
    if (pcnt >= 5):
        if not privacyResult == []:
            movie_posts = [
                {'name': name, 'title': 'Dashboard', 'commentCount': cnt, 'level': level, 'privacyCount': pcnt,
                 'privacy1': privacyResult[0], 'privacy2': privacyResult[1], 'privacy3': privacyResult[2],
                 'privacy4': privacyResult[3], 'privacy5': privacyResult[4]}
            ]

    posts = [
        {'name': name, 'title': 'Dashboard', 'commentCount': cnt, 'level': level, 'privacyCount': pcnt}
    ]

    if (pcnt >= 5):
        return render_template('html/dashboard.html', movie_posts=movie_posts);
    else:
        return render_template('html/dashboard.html', posts=posts);


# movie_page 이동
@app.route('/movie', methods=['GET'])
def movie_page():
    name = session.get('username')

    posts = [
        {'name': name, 'title': 'movie'}

    ]

    return render_template('html/movie.html', posts=posts)


# finder_page 이동
@app.route('/finder', methods=['GET'])
def finder_page():
    name = session.get('username')

    posts = [
        {'name': name, 'title': 'Finder'}

    ]
    return render_template('html/finder.html', posts=posts)


# magazine_page 이동
@app.route('/magazine', methods=['GET'])
def magazine_page():
    name = session.get('username')

    posts = [
        {'name': name, 'title': 'Magazine'}

    ]

    return render_template('html/magazine.html', posts=posts)


# event_page 이동
@app.route('/event', methods=['GET'])
def event_page():
    name = session.get('username')

    posts = [
        {'name': name, 'title': 'Event'}

    ]

    return render_template('html/event.html', posts=posts)


# 회원가입
@app.route('/regist', methods=['POST'])
def regist():
    name_recieve = request.form['name_create']
    email_receive = request.form['email_create']
    password_receive = request.form['password_create']

    if db.user.find_one({'email': email_receive}) is not None:
        return jsonify({'result': 'fail'})  # 중복되면 실패결과 보내기
    else:
        doc = {
            'name': name_recieve,
            'email': email_receive,
            'password': password_receive
        }
        db.user.insert_one(doc)
        return jsonify({'result': 'success'})  # 중복되지 않으면 DB에 저장


# 이메일 입력란 중복체크
@app.route('/email_check', methods=['POST'])
def email_check():
    email_receive = request.form['email_create']

    if db.user.find_one({'email': email_receive}) is not None:
        return jsonify({'result': 'fail'})
    else:
        return jsonify({'result': 'success'})


# 로그인 확인
@app.route('/loginmatch', methods=['POST'])
def match():  # 파라미터 값으로 받음
    email_receive = request.form['email']
    password_receive = request.form['password']

    print("로그인시 이메일" + email_receive)

    result = db.user.find_one({'email': email_receive, 'password': password_receive}, {'_id': 0})

    # 로그인 될때의 list를 가져옴
    print(result)
    return jsonify({'result': result})


# 로그인
@app.route('/logindo', methods=['POST'])
def login():
    # request.form[] 또는 request.values[]로 파라미터를 받아올수있다.
    # 로그인 할때의 id, name, email을 파라미터로 받아 session에 넣어줌
    email = request.form['emailT']
    print("받아온 이메일" + email)
    password = request.form['passwordT']
    print("받아온 비밀번호" + password)

    result = db.user.find_one({'email': email, 'password': password}, {'_id': 0})
    movieResult = list(db.movieComment.find({'email': email}, {'_id': False}))
    privacyResult = list(db.privacyMovie.find({'email': email}, {'_id': False}).sort('date', -1))
    print(movieResult)
    print(privacyResult)

    # 고유값은 email로 설정
    # 받아온값
    name = result['name']
    print(" 받아온 이름:" + name)

    # 해당 아이디의 총 댓글수를 가져옴
    cnt = 0;

    if not movieResult == []:
        for n in movieResult:
            cnt += 1;

    print(cnt)
    # 최근본 영화 기록수 가져옴
    pcnt = 0;
    if not privacyResult == []:
        for n in privacyResult:
            pcnt += 1;

    print(cnt)
    print("로그인후 배열")
    # print(privacyResult[0]['movieImg'])

    level = "일반 회원"
    if (cnt > 30):
        level = "골드 회원"
    elif (cnt > 20):
        level = "실버 회원"
    elif (cnt > 10):
        level = "브론즈 회원"

    # 세션에 name id email넣기
    session['username'] = name
    session['useremail'] = email

    # 세션으로 들어간거 확인됨
    print("현재세션값:%s" % escape(session["username"]))

    # 값이 2개있음
    if (pcnt >= 5):
        if not privacyResult == []:
            movie_posts = [
                {'name': name, 'title': 'Dashboard', 'commentCount': cnt, 'level': level, 'privacyCount': pcnt,
                 'privacy1': privacyResult[0], 'privacy2': privacyResult[1], 'privacy3': privacyResult[2],
                 'privacy4': privacyResult[3], 'privacy5': privacyResult[4]}
            ]

    posts = [
        {'name': name, 'title': 'Dashboard', 'commentCount': cnt, 'level': level, 'privacyCount': pcnt}
    ]

    if (pcnt >= 5):
        return render_template('html/dashboard.html', movie_posts=movie_posts);
    else:
        return render_template('html/dashboard.html', posts=posts);


# 로그아웃시 실행
@app.route("/out")
def logout_page():
    session.pop("username", None)
    session.pop("useremail", None)
    # session.clear()  pop과 동일 기능
    return render_template('index.html')


# 영화 클릭시 상세페이지

@app.route("/movieReview", methods=['POST'])
def movie_review():
    # header는 웹 크롤링 할때 사용
    # headers = {
    #     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    movieId = request.form['movieId']
    print("서버에서 받은 아이디" + movieId)
    data = requests.get(
        'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=da4dc1dad1e98bc657ac0ef27d7126de&language=ko&page=1&region=KR')

    movies = data.json()
    print(movies)

    # 검색한 영화를 담아줄  테이블 생성
    movieImg = movies['poster_path']
    movieTitle = movies['title']
    movieDate = movies['release_date']
    movieRate = movies['vote_average']
    email = session.get('useremail')
    # YYYY/mm/dd HH:MM:SS 형태의 시간 출력
    date = datetime.today().strftime("%Y/%m/%d %H:%M:%S")

    doc = {
        'email': email,
        'movieId': movieId,
        'movieImg': movieImg,
        'movieTitle': movieTitle,
        'movieDate': movieDate,
        'movieRate': movieRate,
        'date': date
    }

    # 최근본 기록 남음
    db.privacyMovie.insert_one(doc)

    return jsonify({'result': 'success', 'movies': movies})


# 영화에 대한 댓글 페이지
@app.route("/movieComment", methods=['POST'])
def movie_comment():
    # YYYY/mm/dd HH:MM:SS 형태의 시간 출력
    date = datetime.today().strftime("%Y/%m/%d %H:%M:%S")

    movieId = request.form['movieId']
    movieComment = request.form['movieComment']

    name = session.get('username')
    email = session.get('useremail')

    print("댓글 입력시 받은 아이디" + movieId)
    doc = {
        'name': name,
        'email': email,
        'movieId': movieId,
        'movieComment': movieComment,
        'like': 0,
        'date': date
    }
    # DB에 입력
    db.movieComment.insert_one(doc)

    # 해당 영화의 댓글 가져오기
    movieResult = list(db.movieComment.find({'movieId': movieId}, {'_id': False}).sort('date', -1))
    print(movieResult)

    return jsonify({'result': 'success', 'moviesComment': movieResult})


# 영화에 대한 댓글 삭제
@app.route("/commentDelete", methods=['POST'])
def comment_delete():
    id_receive = request.form['id_give']
    time_receive = request.form['time_give']

    email = session.get('useremail')

    db.movieComment.delete_one({'movieId': id_receive, 'date': time_receive, 'email': email})

    # 해당 영화의 댓글 가져오기
    movieResult = list(db.movieComment.find({'movieId': id_receive}, {'_id': False}).sort('date', -1))

    return jsonify({'result': 'success', 'moviesComment': movieResult})


# 좋아요 추가기능
@app.route("/likeUpdate", methods=['POST'])
def like_update():
    id_receive = request.form['id_give']
    time_receive = request.form['time_give']

    email = session.get('useremail')

    star = db.movieComment.find_one({'movieId': id_receive, 'date': time_receive, 'email': email})
    new_like = star['like'] + 1

    db.movieComment.update_one({'movieId': id_receive, 'date': time_receive, 'email': email},
                               {'$set': {'like': new_like}})

    # 해당 영화의 댓글 가져오기
    movieResult = list(db.movieComment.find({'movieId': id_receive}, {'_id': False}).sort('date', -1))

    return jsonify({'result': 'success', 'moviesComment': movieResult})


@app.route("/movieSearch", methods=['POST'])
def movie_search():
    # array처럼보이지만 list임
    items = ["asd", "asd33", "a55sd"];
    print(items)

    print("검색한후 값")
    keywords = request.form['keywords']
    genreArray = request.form.getlist('genreArray')
    country = request.form['country']
    grade = request.form['grade']
    print(genreArray)

    for item in genreArray:
        print(item)  # 파이썬은 신기하게 배열로 값들어가있음  36,14

    print(item)
    print(keywords)
    print(country)
    print(grade)

    # 키워드가 없을때 장르검색
    if (keywords == ""):

        data = requests.get(
            "https://api.themoviedb.org/3/discover/movie?api_key=da4dc1dad1e98bc657ac0ef27d7126de&language=ko&region=KR&with_original_language=" + country + "&include_adult=" + grade + "&with_genres=" + item)

        movies = data.json()
        print(movies)
    else:
        # 키워드의 검색결과 추출
        data2 = requests.get(
            'https://api.themoviedb.org/3/search/movie?api_key=da4dc1dad1e98bc657ac0ef27d7126de&query=' + keywords + '&language=ko&region=KR')

        movies = data2.json()
        print(movies)

    return jsonify({'result': 'success', 'movie': movies})


# FinderMovieReview 이동
@app.route('/FinderMovieReview', methods=['POST'])
def Finder_movieReview():
    name = session.get('username')

    movieId = request.form['movieID']
    print(movieId)

    print("서버에서 받은 아이디" + movieId)
    data = requests.get(
        'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=da4dc1dad1e98bc657ac0ef27d7126de&language=ko&page=1&region=KR')

    movies = data.json()
    print(movies)

    # 검색한 영화를 담아줄  테이블 생성
    movieImg = movies['poster_path']
    movieTitle = movies['title']
    movieDate = movies['release_date']
    movieRate = movies['vote_average']
    overview = movies['overview']
    email = session.get('useremail')
    # YYYY/mm/dd HH:MM:SS 형태의 시간 출력
    date = datetime.today().strftime("%Y/%m/%d %H:%M:%S")

    doc = {
        'email': email,
        'movieId': movieId,
        'movieImg': movieImg,
        'movieTitle': movieTitle,
        'movieDate': movieDate,
        'movieRate': movieRate,
        'date': date
    }

    # 최근본 기록 남음
    db.privacyMovie.insert_one(doc)

    # post로 넘길 속성들 정의

    posts = [
        {'name': name,
         'title': 'MovieReview',
         'movieId': movieId,
         'movieImg': movieImg,
         'movieTitle': movieTitle,
         'movieDate': movieDate,
         'movieRate': movieRate,
         'overview': overview
         }
    ]

    return render_template('html/movieReview.html', posts=posts)


# selenium활용한 매거진 크롤링

path="/home/ubuntu/chromedriver"
driver = webdriver.Chrome(executable_path=path, chrome_options=options)
driver.get("http://www.cgv.co.kr/magazine/")


# magazine_list
@app.route('/magazine_list', methods=['GET'])
def magazine_list():
    # text배열 가져옴
    Root_class = driver.find_element_by_id("list_container")
    li_text = Root_class.find_elements_by_tag_name("li")


    a_post = []
    for td in li_text:
        # 링크
        a_row = td.find_element_by_tag_name("a")
        href_row = a_row.get_attribute("href")
        print(href_row)

        # 이미지
        img_row = td.find_element_by_tag_name("img")
        src_row = img_row.get_attribute("src")
        print(src_row)

        # 나머지
        text_row = td.text
        text_row_list = text_row.split("\n")
        print(text_row_list)

        # 배열에 담기
        posts = [
            {
                'img': src_row,
                'link': href_row,
                'title': text_row_list[0],
                'subTitle': text_row_list[1],
                'content': text_row_list[2]
            }
        ]

        a_post = a_post + posts

    print(a_post)

    pp_a = list(db.magazine.find({}, {'_id': False}))
    return jsonify({'result': 'success', 'magazineList': pp_a})


# selenium 활용한 event 크롤링
driver2 = webdriver.Chrome(executable_path=path, chrome_options=options)
driver2.get("http://www.cgv.co.kr/culture-event/event/")


# event_list
@app.route('/event_list', methods=['GET'])
def event_list():
    # text배열 가져옴
    Root_class = driver2.find_element_by_class_name("cf")
    li_text = Root_class.find_elements_by_tag_name("li")

    event_post = []
    for td in li_text:
        # 링크
        a_row = td.find_element_by_tag_name("a")
        href_row = a_row.get_attribute("href")
        print(href_row)

        # 이미지
        img_row = td.find_element_by_tag_name("img")
        src_row = img_row.get_attribute("src")
        print(src_row)

        # 나머지
        text_row = td.text
        text_row_list = text_row.split("\n")
        print(text_row_list)

        # 배열에 담기
        posts = [
            {
                'img': src_row,
                'link': href_row,
                'title': text_row_list[0],
                'date': text_row_list[1]
            }
        ]

        event_post = event_post + posts

    print(event_post)

    pp_b = list(db.event.find({}, {'_id': False}))
    return jsonify({'result': 'success', 'eventList': pp_b})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
