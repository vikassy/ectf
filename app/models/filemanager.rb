class Filemanager < ActiveRecord::Base
	belongs_to :user
  attr_accessible :file, :level, :user_id
end
