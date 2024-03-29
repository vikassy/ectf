class User < ActiveRecord::Base
	has_many :filemanagers
	has_many :finals
  # has_many :flags
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me , :name , :ip
  # attr_accessible :title, :body
end
