class SendfileWorker < ApplicationController

	include Sidekiq::Worker

	def perform(level_id)
		@user = User.all
    password = $password
		#depending on level id go on adding all the file to server!!
		# puts "Next line is level !!"
		# puts $level
		@user.each do |each_user|
			file_details = each_user.filemanagers.where(level: level_id).first
			puts "Next line is file dtails"
			puts file_details
			`./script/automate.sh #{password} #{each_user.ip} #{file_details.file}`
		end
		# $level
		# sleep 10
		@loading = Load.find(1)
		@loading.loading = false
		@loading.save
	end
end
