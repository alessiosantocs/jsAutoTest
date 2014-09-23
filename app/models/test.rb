class Test < ActiveRecord::Base
  after_create :generate_uid

  private
  def generate_uid
    begin
      self.uid = SecureRandom.hex(nil)
    end while Test.find_by_uid(self.uid).present?

    self.save
  end
end
