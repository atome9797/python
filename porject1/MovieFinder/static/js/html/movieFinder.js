 $(document).ready(function(){

        //검색버튼 클릭했을때
        $('#finder_btn').on('click',function(){

            $(".cardList").empty();

            var genreArray= [];
            var country="";
            var grade="";
            let list;

            //검색 키워드
            var keywords=$('#movie_search').val();
            console.log(keywords)

            //장르 선택
            $("input:checkbox[name=genre]:checked").each(function(){
                //배열로 담음
                genreArray.push($(this).val());
            });//for문으로 돌아감

            //배열로 보이지만 사실은 배열이 아닌 나열임 => 배열로 만들기 위해 join해야함
            list = genreArray.join(',');
            console.log(list)

            //나라 선택
            $("input:checkbox[name=country]:checked").each(function(){
                country=$(this).val();
            });//for문으로 돌아감
            console.log(country)

            //관람등급 선택
            $("input:checkbox[name=grade]:checked").each(function(){
                grade=$(this).val();
            });//for문으로 돌아감
            console.log(grade)

            //검색시 ajax
            $.ajax({

                type: 'POST',
                url: 'movieSearch',
                data: {'keywords':keywords,'genreArray':list,'country':country,'grade':grade},
                success: function (res) {
                    let List = res["movie"];
                    console.log(List['results'])
                    let movieList =List['results'];

                     for (let i = 0; i < movieList.length; i++) {

                        let movie = movieList[i];
                        let id = movie["id"];
                        let title = movie["title"];
                        let img = movie["poster_path"];
                        let date = movie["release_date"];
                        let rate = movie["vote_average"];

                        finderCard(id, title, img, date, rate,i);


                    }//end for
                }
            })//end ajax
        });//end 검색버튼 클릭


        // 영화 클릭시 해당 영화에 대한 댓글 페이지 정리
        $(document).on('click','.cardList .card',function() {
            var movieId = $(this).children("#id").val();

            $('#movieID').val(movieId);
            $('#frm').submit();
        });


    })//end ready


    function finderCard(id, title, img, date, rate) {
    let tempHtml = `
              <div class="card" style=" display:inline-block; width: 19%;">
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
            `;
    $(".cardList").append(tempHtml);

    }//end finderCard