class CreateTests < ActiveRecord::Migration
  def change
    create_table :tests do |t|
      t.integer :uid
      t.text :value

      t.timestamps
    end
  end
end
