 $(document).ready(function () {

        //댓글 입렵후 버튼 클릭시
        $('.submitbtn').on('click', function () {
            $('.comment').empty();
            let movieId = $('#movieId').val();
            let movieComment = $('#exampleFormControlTextarea1').val();
            alert("댓글이 입력되었습니다.")

            if (movieComment == "") {
                alert("댓글을 입력해 주세요.")
            } else {
                $.ajax({
                    type: 'POST',
                    url: 'movieComment',
                    data: {'movieId': movieId, 'movieComment': movieComment},
                    success: function (res) {
                        if (res["result"] == "success") {
                            let commentData = res["moviesComment"];

                            for (let i = 0; i < commentData.length; i++) {
                                //배열로 담음
                                let oneComment = commentData[i];

                                let name = oneComment["name"];
                                let movieComment = oneComment["movieComment"];
                                let like = oneComment['like'];
                                let date = oneComment['date'];

                                makeComment(name, movieComment, like, date);
                            }//end for
                        }//end if
                    }//end success
                })//end ajax
            }//end if

            $('#exampleFormControlTextarea1').val('');
            $('.sub').hide();
        });//end submitbtn


        //댓글의 삭제 기능
        $(document).on('click', '.comment .delete', function () {
            $('.comment').empty();
            var movieTime = $(this).val();
            var movieId = $("#movieId").val();
            alert("삭제되었습니다.")
            $.ajax({
                type: 'POST',
                url: 'commentDelete',
                data: {'time_give': movieTime, 'id_give': movieId},
                success: function (res) {
                    if (res["result"] == "success") {
                        let commentData = res["moviesComment"];

                        for (let i = 0; i < commentData.length; i++) {
                            //배열로 담음
                            let oneComment = commentData[i];

                            let name = oneComment["name"];
                            let movieComment = oneComment["movieComment"];
                            let like = oneComment['like'];
                            let date = oneComment['date'];

                            makeComment(name, movieComment, like, date);
                        }//end for
                    }//end if
                }//end success
            })//end ajax
        })


        //좋아요 기능
        $(document).on('click', '.comment .likebtn', function () {
            $('.comment').empty();
            var movieTime = $(this).parent().children("#date").text();
            var movieId = $("#movieId").val();

            alert("좋아요가 완료되었습니다.")
            $.ajax({
                type: 'POST',
                url: 'likeUpdate',
                data: {'time_give': movieTime, 'id_give': movieId},
                success: function (res) {
                    if (res["result"] == "success") {
                        let commentData = res["moviesComment"];

                        for (let i = 0; i < commentData.length; i++) {
                            //배열로 담음
                            let oneComment = commentData[i];

                            let name = oneComment["name"];
                            let movieComment = oneComment["movieComment"];
                            let like = oneComment['like'];
                            let date = oneComment['date'];

                            makeComment(name, movieComment, like, date);
                        }//end for
                    }//end if
                }//end success
            })//end ajax
        })

    });//end ready


    function makeComment(name, movieComment, like, date) {
        let tempHtml =`
                    <hr>
                    <div class="cbox">
                        <div class="cbox-in" style="font-size: 18px;font-weight: bold ">${name}</div>
                        <div class="cbox-in">
                            ${movieComment}
                        </div>
                        <div class="cbox-in" id="date">${date}</div>
                        <button type="button" class="btn btn-outline-secondary delete" name="time" value="${date}" style="margin: 0 3%">삭제</button>

                        <a href="#" class="card-footer-item has-text-info likebtn">
                        좋아요 : ${like}
                        <span class="icon">
                        <i class="fas fa-thumbs-up"></i>
                    </div>`;


        $('.comment').append(tempHtml);
    }
