class CreateFilemanagers < ActiveRecord::Migration
  def change
    create_table :filemanagers do |t|
      t.integer :level
      t.integer :user_id
      t.text :file

      t.timestamps
    end
  end
end
