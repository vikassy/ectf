class CreateIpaddresses < ActiveRecord::Migration
  def change
    create_table :ipaddresses do |t|
      t.string :ip
      t.string :team_name

      t.timestamps
    end
  end
end
