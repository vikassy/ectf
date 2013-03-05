class ResultsController < ApplicationController

  def new
    @flag = Flags.all
  	@result = Result.new
  end

  def create
  	@ans = params[:result][:answer]
    if current_user.id != params[:result][:hacked_id].to_i
  	  @result = Result.find_or_create_by_user_id_and_hacked_id_and_level_id(current_user.id,params[:result][:hacked_id].to_i,$level)
    	if @result.answer == true
        flash[:notice] = "Already answered!!"
    		redirect_to results_path
    	else
     		@req_flag = Flags.where(level: $level,user_id: params[:result][:hacked_id]).first
    		puts "Answer = == #{@ans} &&& required === #{@req_flag}"
    		if @ans == @req_flag.flag
          #Making user marks updated
          final_result = Final.find_or_create_by_user_id(current_user.id)
          if final_result.score == nil
            final_result.score = 10
          else
            final_result.score += 10
          end
          final_result.save
  	  		@result.answer = true
    			@result.save
          flash[:notice] = "Correct Flag!!"
          redirect_to results_path
  	  	else
          flash[:notice] = "Wrong Flag!!"
    			redirect_to new_result_path
          # render 'new'
  	   	end
  	  end
    end
  end

  def index
    @result = Final.all
  end

end
