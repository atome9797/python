$(document).ready(function () {
    $('.swiper-wrapper').empty();
    showPost();
    popularPost();
    RatePost();

})//end ready

//최고 평점 영화
function RatePost() {

    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/movie/top_rated?api_key=da4dc1dad1e98bc657ac0ef27d7126de&language=ko&page=1&region=KR",
        data: {},
        success: function (res) {
            console.log(res);

            let movieList = res["results"];

            for (let i = 0; i < movieList.length; i++) {

                let movie = movieList[i];

                let id = movie["id"];
                let title = movie["title"];
                let img = movie["poster_path"];
                let date = movie["release_date"];
                let rate = movie["vote_average"];

                RateMakeCard(id, title, img, date, rate);

            }//end for

            new Swiper('.swiper-container', {

                slidesPerView: 5, // 동시에 보여줄 슬라이드 갯수
                spaceBetween: 30, // 슬라이드간 간격
                slidesPerGroup: 5, // 그룹으로 묶을 수, slidesPerView 와 같은 값을 지정하는게 좋음

                // 그룹수가 맞지 않을 경우 빈칸으로 메우기
                // 3개가 나와야 되는데 1개만 있다면 2개는 빈칸으로 채워서 3개를 만듬
                loopFillGroupWithBlank: true,

                loop: true, // 무한 반복

                pagination: { // 페이징
                    el: '.swiper-pagination',
                    clickable: true, // 페이징을 클릭하면 해당 영역으로 이동, 필요시 지정해 줘야 기능 작동
                },
                navigation: { // 네비게이션
                    nextEl: '.swiper-button-next', // 다음 버튼 클래스명
                    prevEl: '.swiper-button-prev', // 이번 버튼 클래스명
                },
            });//end swiper
        }//end success

    });//end ajax
}


//인기 영화
function popularPost() {

    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/movie/popular?api_key=da4dc1dad1e98bc657ac0ef27d7126de&language=ko&page=1&region=KR",
        data: {},
        success: function (res) {
            console.log(res);

            let movieList = res["results"];

            for (let i = 0; i < movieList.length; i++) {

                let movie = movieList[i];

                let id = movie["id"];
                let title = movie["title"];
                let img = movie["poster_path"];
                let date = movie["release_date"];
                let rate = movie["vote_average"];

                PopularMakeCard(id, title, img, date, rate);

            }//end for

            new Swiper('.swiper-container', {

                slidesPerView: 5, // 동시에 보여줄 슬라이드 갯수
                spaceBetween: 30, // 슬라이드간 간격
                slidesPerGroup: 5, // 그룹으로 묶을 수, slidesPerView 와 같은 값을 지정하는게 좋음

                // 그룹수가 맞지 않을 경우 빈칸으로 메우기
                // 3개가 나와야 되는데 1개만 있다면 2개는 빈칸으로 채워서 3개를 만듬
                loopFillGroupWithBlank: true,

                loop: true, // 무한 반복

                pagination: { // 페이징
                    el: '.swiper-pagination',
                    clickable: true, // 페이징을 클릭하면 해당 영역으로 이동, 필요시 지정해 줘야 기능 작동
                },
                navigation: { // 네비게이션
                    nextEl: '.swiper-button-next', // 다음 버튼 클래스명
                    prevEl: '.swiper-button-prev', // 이번 버튼 클래스명
                },
            });//end swiper
        }//end success

    });//end ajax
}

//최신 영화
function showPost() {

    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/movie/now_playing?api_key=da4dc1dad1e98bc657ac0ef27d7126de&language=ko&page=1&region=KR",
        data: {},
        success: function (res) {
            console.log(res);

            let movieList = res["results"];

            for (let i = 0; i < movieList.length; i++) {

                let movie = movieList[i];

                let id = movie["id"];
                let title = movie["title"];
                let img = movie["poster_path"];
                let date = movie["release_date"];
                let rate = movie["vote_average"];

                makeCard(id, title, img, date, rate);

            }//end for

            new Swiper('.swiper-container', {

                slidesPerView: 5, // 동시에 보여줄 슬라이드 갯수
                spaceBetween: 30, // 슬라이드간 간격
                slidesPerGroup: 5, // 그룹으로 묶을 수, slidesPerView 와 같은 값을 지정하는게 좋음

                // 그룹수가 맞지 않을 경우 빈칸으로 메우기
                // 3개가 나와야 되는데 1개만 있다면 2개는 빈칸으로 채워서 3개를 만듬
                loopFillGroupWithBlank: true,

                loop: true, // 무한 반복

                pagination: { // 페이징
                    el: '.swiper-pagination',
                    clickable: true, // 페이징을 클릭하면 해당 영역으로 이동, 필요시 지정해 줘야 기능 작동
                },
                navigation: { // 네비게이션
                    nextEl: '.swiper-button-next', // 다음 버튼 클래스명
                    prevEl: '.swiper-button-prev', // 이번 버튼 클래스명
                },
            });//end swiper
        }//end success

    });//end ajax


}//end showPost


function makeCard(id, title, img, date, rate) {
    let tempHtml = `<div class="swiper-slide chooseMovie" style="width:145.2px; margin-right: 30px;">
                        <div class="card">
                            <img src="https://image.tmdb.org/t/p/w185${img}" class="card-img-top" alt="movie_image">
                            <input type="hidden" name="id" id="id" value="${id}"/>
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted">개봉일: ${date}</small>
                                <small class="text-muted">평점: ${rate}</small>
                            </div>
                       </div>
                    </div>`;
    $(".card-deck .swiper-wrapper").append(tempHtml);

}//end makeCard

//인기영화
function PopularMakeCard(id, title, img, date, rate) {
    let tempHtml = `<div class="swiper-slide chooseMovie" style="width:145.2px; margin-right: 30px;">
                        <div class="card">
                            <img src="https://image.tmdb.org/t/p/w185${img}" class="card-img-top" alt="movie_image">
                            <input type="hidden" name="id" id="id" value="${id}"/>
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted">개봉일: ${date}</small>
                                <small class="text-muted">평점: ${rate}</small>
                            </div>
                       </div>
                    </div>`;
    $(".popularCard-deck .swiper-wrapper").append(tempHtml);

}//end makeCard

function RateMakeCard(id, title, img, date, rate) {
    let tempHtml = `<div class="swiper-slide chooseMovie" style="width:145.2px; margin-right: 30px;">
                        <div class="card">
                            <img src="https://image.tmdb.org/t/p/w185${img}" class="card-img-top" alt="movie_image">
                            <input type="hidden" name="id" id="id" value="${id}"/>
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted">개봉일: ${date}</small>
                                <small class="text-muted">평점: ${rate}</small>
                            </div>
                       </div>
                    </div>`;
    $(".RateCard-deck .swiper-wrapper").append(tempHtml);

}//end makeCard



