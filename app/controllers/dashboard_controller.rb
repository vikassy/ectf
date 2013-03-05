class DashboardController < ApplicationController
  before_filter :authenticate_user!  
  def index
    @title = "Dashboard"
    const_time = 500 #15 mins = 15*60=900sec
    # @clock = @time_past/const_time
    # $level = 0
    @time_rem = const_time - (Time.now - $time).to_i
    @loading = Load.find(1)
      @loading.save
    if @loading != true
      if @time_rem <= 600  && $level == 0#Check if the level is 0 and 15 mins are over !!
       #if yes then start loading next question!!
       @loading.loading = true
       @loading.save
       $level+=1
       $time = Time.now
       SendfileWorker.perform_async($level)
      elsif @time_rem <= 0  && $level == 1
        @loading.loading = true
       @loading.save
       $level+=1
       $time = Time.now
       SendfileWorker.perform_async($level)
       elsif @time_rem <= 0  && $level == 2
       @loading.loading = true
       @loading.save
       $level+=1
       $time = Time.now
       SendfileWorker.perform_async($level)
       elsif @time_rem <= 0  && $level == 3
       @loading.loading = true
       @loading.save
       $level+=1
       $time = Time.now
       SendfileWorker.perform_async($level)         
      end
    end
  	@time_rem = const_time - (Time.now - $time).to_i
    @sec = @time_rem%60
      # @loading.loading = false
    @user = User.all
  	# $level=0
  end

  def result
    @result = Result.new
  end

  def ip
    @ip = request.remote_ip
  end

end
