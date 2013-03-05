class Flags < ActiveRecord::Base
  # belongs_to :user
  attr_accessible :flag, :level, :user_id
end
